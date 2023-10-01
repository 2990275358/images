const fs = require('fs')
const path = require('path')

const express = require('express');
const multer = require("multer");
const app = require('../app/index');
const upload = multer({ dest: path.join(__dirname,'../uploads/') })
// console.log(path.join(__dirname,'../uploads/'));
const route = express.Router();

//文章路由处理函数
function saveFile(file, name,originalname) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, async (err, data) => {
      if (err) {
        reject(err)
      }
      // 写入图片
      // 写入自己想要存入的地址
      const extname = path.extname(originalname);
      await fs.writeFile(path.join(__dirname, `../uploads/${name}${extname }`), data, err => {
        //写入失败
        if (err) { reject(err) }
        //写入成功，同时返回需要存储在数据中的相对路径
        resolve(`/upload/${name}`)
      })
      // 删除二进制文件
      await fs.unlink(file.path, err => {
        if (err) { reject(err) }
      })
    })
  })
}

route.post('/upload', upload.any(), (req, res) => {
  console.log(req.files);
  const files = req.files;
  files.forEach(file => {
    saveFile(file,file.filename,file.originalname).then(res => {
      console.log(res);
    })
  })
  res.end("上传成功~")
});

route.get("/", (req, res) => {
  res.render("video")
})

route.get("/read", (req, res) => {
  let num = req.query.num || 0;
  const filenames = fs.readdirSync(path.join(__dirname, `../uploads`));
  num = num >= filenames.length ? filenames.length - 1 : num;
  const filepath = path.join(__dirname, `../uploads/${filenames[num]}`);
  fs.stat(filepath,(err,stats) => {
    if(err){
      res.send(err);
      return;
    }
    var range = req.headers.range || "bytes=0";
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0]);
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1]) : total - 1;
    var chunksize = (end - start) + 1;
    res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
    });
    const read = fs.createReadStream(filepath ,{start: start, end: end});
    read.on("open",() => {
      read.pipe(res)
    })
  })
  // fs.readFile(path.join(__dirname, `../uploads/fc287bc27bdbb214d107c23c85e56e08.mp4`),"binary",(err,file) => {
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.write(file, "binary");
  //     res.end();
  //   }
  // })
})



app.use('/video', route);