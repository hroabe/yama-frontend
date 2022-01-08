import React, { useEffect, useState } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L, { LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import axios, {AxiosResponse} from "axios"
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const url = "https://opendata.yamanashi.dev/api/yama"
  const position = new LatLng(35.667160, 138.568993);

  const [yamalist, setYamaList] = useState<Array<{[key: string]: string}>>([])

  // 山梨県が含まれる山一覧を取得する
  const getYamaFromBackend = async () => {
    await axios.create({baseURL: url}).get("?keys=都道府県&values=山梨県", 
    {
      headers : { Accept: "application/json"}
    }).then(function (response: AxiosResponse) {
      let values : Array<{[key: string]: string}> = response.data.data
      setYamaList(values)      
    })
    .catch(function (error: AxiosResponse) {
      console.log(error)
    })    
  }

  useEffect(() => {
    // 山梨県が含まれる山一覧を取得する
    void getYamaFromBackend()
  }, [])

  return (
    <div className="App">
      <MapContainer center={position} zoom={13}>
      <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          yamalist.map((yama)=>{
            if (typeof yama !== "undefined" && "url" in yama){
              let pos = yama["url"].split("/")
              if (pos.length >= 2){
                let lat = Number.parseFloat(pos[pos.length-2])
                let lng = Number.parseFloat(pos[pos.length-1])
                return (
                  <Marker position={[lat,lng]} key={lat+","+lng}>
                    <Popup>
                      {yama["山名<山頂名>"]} <br/>
                      {lat},{lng} <br/>
                      標高: {yama["標高"]} <br/>
                      都道府県: {yama["都道府県"]} <br/>
                    </Popup>
                  </Marker>
                )
              }else{
                return(<></>)
              }
            }else{
              return(<></>)
            }
          })
        }      
      </MapContainer>
    </div>
  )
}

export default App
