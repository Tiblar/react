/**
 *
 * @param thumbnails
 * @param size - large, small
 */
export function getThumbnail(thumbnails, size) {
    thumbnails = thumbnails.sort(function (a, b) {
        if(a.file && b.file && a.file.width && b.file.width){
            return b.file.width - a.file.width;
        }

        return -1;
    });

    if(size === "large"){
        return thumbnails[0];
    }

    if(size === "small"){
        return thumbnails[thumbnails.length-1];
    }
}
