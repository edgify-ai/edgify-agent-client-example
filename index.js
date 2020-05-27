import {EdgifyServiceClient} from 'edgify-client';
import {
  PredictionRequest,
  GroundTruthRequest,
  GroundTruth,
} from 'edgify-client/prediction_pb';

const client = new EdgifyServiceClient ('http://127.0.0.1:9090');

let currentPrediction = null;

const makePrediction =  () => {
  const req = new PredictionRequest ();
  client.getPrediction (req, (err, resp) => {
    currentPrediction = resp.getPrediction ();
    renderPrediction()    
  });
}
const sendGt =  () => {
  const req = new GroundTruthRequest ();
  const gt = new GroundTruth ();
  gt.setPrediction (currentPrediction);
  gt.setLabel ('banana');
  req.setGroundtruth (gt);
  client.createGroundTruth (req, (err, resp) => {
    if (err) {
      alert (err);
    }
    currentPrediction = null;
    renderPrediction()
  });
}

const renderPrediction = () => {
  const conainerElement = document.getElementById("container")
  const newContainer =document.createElement("div")
  newContainer.setAttribute("id","container")
  if (currentPrediction) {
    const predictionObject =currentPrediction.toObject();
    const uuid = document.createTextNode(`UUID: ${predictionObject.uuid}`)
    const duration = document.createTextNode(`Duration: ${predictionObject.duration}`)
    const predicedAt = document.createTextNode(`PredicedAt: ${predictionObject.predictedAt}`)
    const modelId = document.createTextNode(`UUID: ${predictionObject.modelId}`)
    const predictionsList = document.createTextNode(`PredictionsList: ${predictionObject.predictionsList.map(l => l.dataList.join(':'))}`)
    const img = document.createElement("img")
    img.setAttribute("width", "300px")
    img.setAttribute("height", "300px")
    img.setAttribute("src", `data:image/jpeg;base64,${predictionObject.image.image}`)
    newContainer.appendChild(uuid)
    newContainer.appendChild(document.createElement('br'))
    newContainer.appendChild(duration)
    newContainer.appendChild(document.createElement('br'))
    newContainer.appendChild(predicedAt)
    newContainer.appendChild(document.createElement('br'))
    newContainer.appendChild(modelId)
    newContainer.appendChild(document.createElement('br'))
    newContainer.appendChild(predictionsList)
    newContainer.appendChild(document.createElement('br'))
    newContainer.appendChild(img)
    newContainer.appendChild(document.createElement('br'))

  }
  conainerElement.replaceWith(newContainer)
}

window.onload= () => {
  document.getElementById("makePredicionBtn").onclick = makePrediction;
  document.getElementById("sendGtBtn").onclick = sendGt;
}

