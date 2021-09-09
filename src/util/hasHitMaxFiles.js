import {MAX_DEFAULT_FILES, MAX_IMAGE_FILES, POST_IMAGE} from "./constants";

function hasHitMaxFiles(files, postType) {
    if(postType === POST_IMAGE && files.length < MAX_IMAGE_FILES){
        return false;
    }

    return files.length >= MAX_DEFAULT_FILES;
}

export default hasHitMaxFiles;
