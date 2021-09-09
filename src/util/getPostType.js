import {
    POST_AUDIO,
    POST_AUDIO_EXTENSIONS, POST_FILE, POST_FILE_EXTENSIONS,
    POST_IMAGE,
    POST_IMAGE_EXTENSIONS, POST_PDF, POST_PDF_EXTENSIONS,
    POST_VIDEO,
    POST_VIDEO_EXTENSIONS
} from "./constants";

function getPostType(fileName){
    const endsWithAny = (string, suffixes) => {
        return suffixes.some(function (suffix) {
            if(typeof fileName !== "string"){
                return false;
            }

            return string.toLowerCase().endsWith(suffix.toLowerCase());
        });
    }

    return new Promise((resolve, reject) => {
        switch(true){
            case endsWithAny(fileName, POST_IMAGE_EXTENSIONS):
                resolve(POST_IMAGE);
                return;
            case endsWithAny(fileName, POST_VIDEO_EXTENSIONS):
                resolve(POST_VIDEO);
                return;
            case endsWithAny(fileName, POST_AUDIO_EXTENSIONS):
                resolve(POST_AUDIO);
                return;
            case endsWithAny(fileName, POST_PDF_EXTENSIONS):
                resolve(POST_PDF);
                return;
            case endsWithAny(fileName, POST_FILE_EXTENSIONS):
                resolve(POST_FILE);
                return;
        }

        reject("Not a supported file");
    });
}

export default getPostType;
