const canvasDataURL = (path, obj, callback) => {
    const img = new Image();
    img.src = path;
    img.onload = function(){
        const that = this;
        // 默认按比例压缩
        let w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        let quality = 0.8;  // 默认图片质量为0.7
        //生成canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // 创建属性节点
        const anw = document.createAttribute("width");
        anw.nodeValue = w;
        const anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        const base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
};

export default canvasDataURL
