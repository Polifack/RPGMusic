const fs = require('electron').remote.require('fs')
const dataurl = require('dataurl')
const { dialog } = require('electron').remote


//Gets uri from song path
function getSongData(song){
  let filePath = song.path
  const songPromise = new Promise((resolve) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {throw (err)}
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }))
    });
  });
  
  return songPromise;
}

//Loads an array of songs from the filesystem
async function handleFileSelect() {
  var files = (await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'], filters: [{ name: 'Audio', extensions: ['mp3']}]}))
  var array = []
  console.log(files)
  files.forEach((fp) => array.push({path: fp, title: fp.replace(/^.*[\\]/, '')}))
  
  return array
}

//Loads a song from filesystem
async function handleSongSelect(){
  let result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Audio', extensions: ['mp3']}]})

  if (result!==undefined){
    let filePath = result[0]
    var song = {path: filePath, title: filePath.replace(/^.*[\\]/, '')}
  
    return song
  }
  else{
    return undefined
  }


}

//Saves data as a json file with rpgm extension
async function handleFileSave(data){
  let filePath = await dialog.showSaveDialog({filters: [{ name: 'RPGMusic', extensions: ['rpgm']}]})  
  console.log(data)
  if (filePath!==undefined){
    let fileData = JSON.stringify(data)
    fs.writeFileSync(filePath, fileData)
  }  
}

async function handleSceneSave(data){
  let result = await dialog.showSaveDialog({filters: [{ name: 'RPGScene', extensions: ['rpgs']}]})  
  
  if (result!==undefined){
    let filePath = result[0]
    let fileData = JSON.stringify(data)
    fs.writeFileSync(filePath, fileData)
  }  
}

//Opens file with rpgm extension and loads it as json
async function handleFileOpen(){
  let result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'RPGMusic', extensions: ['rpgm']}]})
  console.log(result)
  if (result!==undefined){
    let filePath = result[0]
    let fileData = JSON.parse(await fs.readFileSync(filePath))
    return fileData
  }
  else{
    return undefined
  }
}

async function handleSceneOpen(){
  let result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'RPGScene', extensions: ['rpgs']}]})
  
  if (result!==undefined){
    let filePath = result[0]
    let fileData = JSON.parse(await fs.readFileSync(filePath))
    return fileData
  }
  else{
    return undefined
  }
}



export {handleFileSelect, handleFileSave, getSongData, handleFileOpen, handleSceneSave, handleSceneOpen, handleSongSelect}
