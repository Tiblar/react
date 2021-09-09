const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const rotateN = (file, n) => new Promise((resolve, reject) => {
    if(n > 360){
        reject();
        return;
    }

    if(n === 0 || n === 360) {
        resolve(file);
        return;
    }

    let img = new Image();
    img.src = file;
    img.onload = function() {
        let canvas = document.createElement('canvas');

        if(n !== 180){
            canvas.width = img.height;
            canvas.height = img.width;
        }else{
            canvas.height = img.height;
            canvas.width = img.width;
        }

        canvas.style.position = "absolute";
        let ctx = canvas.getContext("2d");
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate((Math.PI / 180) * n);
        ctx.drawImage(img, -img.width/2, -img.height/2);


        resolve(canvas.toDataURL());
    }
});

const urlToFile = (url, filename, mimeType) => {
    return (fetch(url,{mode:"cors"})
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
};

const imageToDimensions = file => new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img
        resolve({ width, height })
    }

    img.onerror = () => {
        reject()
    }

    img.src = URL.createObjectURL(file)
})

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
    return Math.round(bytes / Math.pow(1000, i), 2) + ' ' + sizes[i];
}

export {toBase64, rotateN, urlToFile, imageToDimensions, bytesToSize};