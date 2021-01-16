const axios = require('axios')
const apiUrl = 'https://toer.io/api/'


const Api = {
    
  uploadAudiofile : async function(audioBlob, progressCallback) {
    // Make the multipart formdata for a blob.
    const formData = new FormData()
    formData.append('audioFile', audioBlob)
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      },
      onUploadProgress: ProgressEvent => {
        progressCallback(ProgressEvent.loaded, ProgressEvent.total)
      }
    }

    const resp = await axios.post(`${apiUrl}upload`, formData, config);
    return resp.data;
  },

  createTour : async function (tourObject) {
    return await axios.post(`${apiUrl}tours`, {tour : tourObject })
  },

  fetchTours : async function() {
    const resp = await axios.get(`${apiUrl}tours`)
    return resp.data
  },

  getAudioFile: function (fileId) {
    // Retrieves the blob from the server and returns the audiofile.
    const url = `${apiUrl}tours/files/${fileId}`
    const response = axios.get(url, { responseType : 'blob'})
    
    return new Blob([response.data])
  },

  /*
    Returns the url where the file can be found given its id.
  */
  getFileURI : function (fileId) {
    return `${apiUrl}tours/files/${fileId}`
  },
  
}

export default Api;