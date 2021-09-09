import axios from "axios";

import {
    UPDATE_SHAKE,
    UPDATE_FILES,
    UPDATE_POST_TYPE,
    UPDATE_ERROR,
    UPDATE_POLL_QUESTION,
    UPDATE_POLL_OPTION,
    UPDATE_MAGNET,
    UPDATE_SIZE_ERROR, UPDATE_LARGE_FILE_STATUS, UPDATE_LARGE_FILE_PART, UPDATE_LARGE_FILE_TOTAL
} from "../context";
import {imageToDimensions, rotateN, toBase64, urlToFile} from "../../../../../../../util/fileMutator";
import {
    POST_AUDIO, POST_AUDIO_MAX_SIZE, POST_FILE, POST_FILE_MAX_SIZE,
    POST_IMAGE, POST_IMAGE_MAX_SIZE, POST_PDF, POST_PDF_MAX_SIZE,
    POST_TEXT, POST_VIDEO, POST_VIDEO_MAX_SIZE,
    POST_BOOST_AUDIO_MAX_SIZE, POST_BOOST_FILE_MAX_SIZE,
    POST_BOOST_PDF_MAX_SIZE, POST_BOOST_VIDEO_MAX_SIZE, API_URL
} from "../../../../../../../util/constants";
import hasHitMaxFiles from "../../../../../../../util/hasHitMaxFiles";
import getPostType from "../../../../../../../util/getPostType";
import {numberWithCommas} from "../../../../../../../util/formatNumber";

function getNextRow(files) {
    let total = 0;

    files.forEach(file => {
        total = file.row.row > total ? file.row.row : total;
    });

    if(total === 0 && files.length === 0) return 0;

    return total  + 1;
}

async function checkPostType(postType, file){
    let fileType = await getPostType(file.name);

    return new Promise((resolve, reject) => {
        if(postType !== fileType){
            reject("You cannot mix post types (e.g. images and videos)")
            return;
        }

        resolve()
    })
}

async function buildImageFile(file, row, rotate = 0, id = null) {
    let base64 = await toBase64(file);
    base64 = await rotateN(base64, rotate);

    let { width, height } = await imageToDimensions(file);

    id = id === null ? [...Array(36)].map(() => Math.random().toString(36)[2]).join('') : id;

    if(rotate === 90 || rotate === 270){
        let oldWidth = width;
        width = height;
        height = oldWidth;
    }

    let rotatedFile = await urlToFile(base64, file.name, file.type);

    return {
        id: id,
        file: file,
        rotate: rotate,
        rotatedFile: rotatedFile,
        isLargeFile: file.size > 95000000,
        row: {
            row: row,
            pos: 0,
        },
        base64: base64,
        width: width,
        height: height,
    };
}

async function buildDefaultFile(file, id = null) {

    id = id === null ? [...Array(36)].map(() => Math.random().toString(36)[2]).join('') : id;

    let blob = URL.createObjectURL(file);

    return {
        id: id,
        file: file,
        blob: blob,
        isLargeFile: file.size > 95000000,
        row: {
            row: 0,
            pos: 0,
        },
    };
}

async function startLargeFile(file) {
    let fileSize = file.file.size;
    let name = file.file.name;

    let blob = URL.createObjectURL(file.file);

    const CryptoJS = await import("crypto-js");

    let wordArr = CryptoJS.lib.WordArray.create(blob);
    let sha1 = CryptoJS.SHA1(wordArr);

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const data = {
        file_size: fileSize,
        file_name: name,
        sha1_hash: sha1.toString(),
    };

    let res = await axios.post(API_URL + "/post/large-file", data, config);

    if(res.status === 200 && res.data.data.file_id && res.data.data.part_count){
        return {
            file_id: res.data.data.file_id,
            part_count: res.data.data.part_count,
        }
    }

    return false;
}

async function finishLargeFile(fileId) {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    let res = await axios.post(API_URL + "/post/large-file/" + fileId + "/finish", {}, config);

    return res.status === 200;
}

function createActions(dispatch, state) {

    const uploadLargeFile = async (file) => {

        async function uploadPart(file, fileId, partNumber, attempt = 0){
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            let filePart = file.file.slice((partNumber - 1) * 10000000, ((partNumber - 1) * 10000000) + 10000000);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };

            const data = new FormData();
            data.append("file_part", filePart);

            try {
                let res = await axios.post(API_URL + "/post/large-file/" + fileId + "/" + partNumber, data, config);

                if(res.status === 200){
                    return true;
                }else{
                    dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "RETRYING_PART" })

                    if(attempt > 4){
                        return false;
                    }
                    await sleep(2000);

                    return (await uploadPart(file, fileId, partNumber, attempt + 1));
                }
            }catch (e) {
                dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "RETRYING_PART" })

                if(attempt > 4){
                    return false;
                }
                await sleep(2000);

                return (await uploadPart(file, fileId, partNumber, attempt + 1));
            }

        }

        dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "UPLOADING" })

        let initFile = await startLargeFile(file);

        if(initFile === false){
            dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "FAILED" })
            return;
        }

        let fileId = initFile.file_id;
        let partCount = initFile.part_count;

        dispatch({ type: UPDATE_LARGE_FILE_TOTAL, payload: partCount });

        for(let i = 1;i<=partCount;i++){
            dispatch({ type: UPDATE_LARGE_FILE_PART, payload: i });
            dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "UPLOADING" })

            let status = false;
            try{
                status = await uploadPart(file, fileId, i);
            }catch (e){ }

            if(status === false){
                dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "FAILED" })
                return;
            }
        }

        let isFinished = await finishLargeFile(fileId);

        if(isFinished === false){
            dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: "FAILED" })
            return;
        }

        dispatch({ type: UPDATE_LARGE_FILE_STATUS, payload: null });

        let {largeFiles} = state;

        largeFiles.push({
            file_id: fileId,
            file: file,
        });
    };

    const addFile = async (file, row = null, type = null) => {
        await addFiles([file], row)
    };

    const addFiles = async (newFiles, row = null, type = null) => {
        let {files} = state;
        dispatch({ type: UPDATE_ERROR, payload: null })
        dispatch({ type: UPDATE_SIZE_ERROR, payload: null })

        for(const file of newFiles) {
            try{
                let postType = await getPostType(file.name);

                if(type !== null){
                    if(postType !== type){
                        throw new Error("File is not a supported file.");
                    }
                }

                let fileSize = file.size / 1000 / 1000;

                let postVideoMaxSize = POST_VIDEO_MAX_SIZE;
                let postAudioMaxSize = POST_AUDIO_MAX_SIZE;
                let postPDFMaxSize = POST_PDF_MAX_SIZE;
                let postFileMaxSize = POST_FILE_MAX_SIZE;

                if(state.isBoosted){
                    postVideoMaxSize = POST_BOOST_VIDEO_MAX_SIZE;
                    postAudioMaxSize = POST_BOOST_AUDIO_MAX_SIZE;
                    postPDFMaxSize = POST_BOOST_PDF_MAX_SIZE;
                    postFileMaxSize = POST_BOOST_FILE_MAX_SIZE;
                }

                if(postType === POST_IMAGE && fileSize > POST_IMAGE_MAX_SIZE){
                    dispatch({ type: UPDATE_SIZE_ERROR, payload: "Images must be less than " + POST_IMAGE_MAX_SIZE + "mb."  });
                    continue;
                }

                if(postType === POST_VIDEO && fileSize > postVideoMaxSize){
                    dispatch({ type: UPDATE_SIZE_ERROR, payload: "Videos must be less than " + numberWithCommas(postVideoMaxSize) + "mb."  });
                    continue;
                }

                if(postType === POST_AUDIO && fileSize > postAudioMaxSize){
                    dispatch({ type: UPDATE_SIZE_ERROR, payload: "Audio files must be less than " + numberWithCommas(postAudioMaxSize) + "mb."  });
                    continue;
                }

                if(postType === POST_PDF && fileSize > postPDFMaxSize){
                    dispatch({ type: UPDATE_SIZE_ERROR, payload: "PDFs must be less than " + numberWithCommas(postPDFMaxSize) + "mb."  });
                    continue;
                }

                if(postType === POST_FILE && fileSize > postFileMaxSize){
                    dispatch({ type: UPDATE_SIZE_ERROR, payload: "Files must be less than " + numberWithCommas(postFileMaxSize) + "mb."  });
                    continue;
                }

                if(hasHitMaxFiles(files, postType)) break;

                if(files > 0){
                    await checkPostType(file)
                }else{
                    dispatch({ type: UPDATE_POST_TYPE, payload: postType });
                }

                if(postType === POST_IMAGE){
                    let nextRow = row === null ? getNextRow(files) : row;
                    let newFile = await buildImageFile(file, nextRow, 0);
                    files.push(newFile);
                }

                if([POST_VIDEO, POST_AUDIO, POST_PDF, POST_FILE].includes(postType)){
                    let newFile = await buildDefaultFile(file);
                    files.push(newFile);
                }

            }catch(err){
                dispatch({ type: UPDATE_SHAKE, payload: true })
                dispatch({ type: UPDATE_ERROR, payload: err })

                setTimeout(() => {
                    dispatch({ type: UPDATE_SHAKE, payload: false })
                }, 2000)
            }
        }

        files.sort(function(a, b) {
            return a.row.row - b.row.row;
        });

        dispatch({ type: UPDATE_FILES, payload: files })
    };

    const updateFile = async (updatedFile) => {
        let {files} = state;

        for (const [i, file] of files.entries()) {
            if(updatedFile.id === file.id){
                files[i] = await buildImageFile(updatedFile.file, updatedFile.row.row, updatedFile.rotate, updatedFile.id);
            }
        }

        dispatch({ type: UPDATE_FILES, payload: files })
    };

    const removeFile = async (removedFile) => {
        let {files} = state;

        let newFiles = files.filter(file => file.id !== removedFile.id);

        if(newFiles.length === 0){
            dispatch({ type: UPDATE_POST_TYPE, payload: POST_TEXT })
        }

        if(removedFile.row === undefined){
            dispatch({ type: UPDATE_FILES, payload: newFiles })
            return;
        }

        let fileRow = removedFile.row.row;
        let shouldIndex = !newFiles.map(file => {
            return file.row.row
        }).includes(fileRow);

        if(shouldIndex){
            newFiles = newFiles.map(file => {
                if(file.row.row > fileRow){
                    file.row.row -= 1;
                }

                return file;
            });
        }

        dispatch({ type: UPDATE_FILES, payload: newFiles })
    };

    const setQuestion = (value) => {
        dispatch({ type: UPDATE_POLL_QUESTION, payload: value })
    }

    const setOption = (option, value) => {
        dispatch({ type: UPDATE_POLL_OPTION, option: option, payload: value })
    }

    const setMagnet = (value) => {
        dispatch({ type: UPDATE_MAGNET, payload: value })
    }

    return {
        uploadLargeFile: uploadLargeFile,
        addFile: addFile,
        addFiles: addFiles,
        updateFile: updateFile,
        removeFile: removeFile,
        setQuestion: setQuestion,
        setOption: setOption,
        setMagnet: setMagnet,
    };
}

export default createActions;
