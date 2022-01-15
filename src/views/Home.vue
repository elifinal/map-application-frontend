<template>
<div class="dashboard">
  <Sidebar/>
  <div class="content">
    <router-view/>
  </div>
</div>
<!-- <div class="row ">
  <div class="col col-3 dashboard">  <Sidebar/></div>
  <div class="col col-9">
      <div id="map">
        <div id="form" v-if="isShow">
          <form>
              Description:<br><input v-model="input_desc" id="input_desc"><br>
              Name:<br><input v-model="input_name" type="text" id="input_name"><br>
              <div class="buttons">
              <button value="Submit" class="btn" @click="submit">save</button>
              <button value="cancel" class="btn" @click="cancel">cancel</button>
              </div>
          </form>
        </div>
      </div>
  </div>
</div> -->

</template>

<script>
// @ is an alias to /src
// import '@vue-leaflet/vue-leaflet';
// import L from 'leaflet';
// import { ref } from 'vue';
// import LDraw from 'leaflet-draw';
// import * as L from 'leaflet';
// import 'leaflet-draw';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';
// import vmodal from 'vue-js-modal';

export default {
  name: 'Home',
  // data() {
  //   return {
  //     datas: {
  //       locations: '',
  //       type: '',
  //       name: '',
  //       desc: '',
  //       radius: '',
  //     },
  //     map: null,
  //     editableLayers: null,
  //     layer: null,
  //     MyCustomMarker: null,
  //     drawnItems: null,
  //     // datas: null,
  //     // showModal: true,
  //     isShow: false,
  //     input_desc: '',
  //     input_name: '',
  //   };
  // },
  components: {
    Sidebar,
  },
  // mounted() {
  //   this.createMap();
  //   this.createEvent();
  //   // this.createFormPopup();
  // },
  // methods: {
  //   createMap() {
  //     this.map = L.map('map').setView([38.9637, 35.2433], 6);
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(this.map);
  //     this.drawnItems = L.featureGroup().addTo(this.map);
  //     new L.Control.Draw({
  //       edit: {
  //         featureGroup: this.drawnItems,
  //       },
  //     }).addTo(this.map);
  //   },
  //   createEvent() {
  //     this.map.on(L.Draw.Event.CREATED, (e) => {
  //       this.drawnItems.addLayer(e.layer);
  //       // e.layer.addTo(this.drawnItems);
  //       this.datas.type = e.layerType;
  //       console.log(e);
  //       // this.showModal();
  //       // this.$refs.modal.show();
  //       this.createFormPopup();
  //       this.drawnItems.eachLayer((layer) => {
  //         // const geojson = JSON.stringify(layer.toGeoJSON().geometry);
  //         // console.log(geojson);
  //         this.datas.locations = layer.toGeoJSON().geometry.coordinates;
  //         this.datas.radius = layer.options.radius ? layer.options.radius : null;
  //         console.log('drawnItems', this.datas);
  //       });
  //     });
  //     // this.map.on(L.Draw.Event.EDITED, (e) => {
  //     //   console.log('e', e);
  //     // });
  //   },
  //   createDelete() {
  //     /* eslint-disable */
  //     for (const i in this.map._layers) {
  //       if (this.map._layers[i]._path !== undefined) {
  //         this.map.removeLayer(this.map._layers[i])
  //       }
  //     }
  //     console.log(this.map._layers);
  //   },

  //   submit() {
  //     this.datas.name = this.input_name;
  //     this.datas.desc = this.input_desc;
  //     console.log(this.datas);
  //     axios.post('http://127.0.0.1:8000/post/save/', { data: this.datas }).then((Response) => {
  //       console.log(Response);
  //     })
  //       .catch((e) => console.log(e));
  //     this.isShow = false;
  //     this.input_desc = '';
  //     this.input_name = '';
  //     this.createDelete();
  //     this.createSaved();

  //   },
  //   cancel() {
  //     this.isShow = false;
  //     this.input_desc = '';
  //     this.input_name = '';
  //     this.createDelete();
  //   },

  //   createSaved() {
  //     const popupcontent = 'Area Saved';
  //     this.drawnItems.bindPopup(popupcontent).openPopup();
  //   },

  //   createFormPopup() {
  //     this.isShow = true;
  //   },
  // },
};
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 5fr;
  background-color: teal;
  height: 100vh;
  width: 100vw;
}
.content {
  background-color: white;
  border-radius: 10px;
  margin: 6px 6px 6px 0px;
}

/* #map{
width: 100%;
height: 100%;
}
#form{
position: absolute;
top: 0;
right: 5rem;
height: 2rem;
z-index: 999;
}
.btn{
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 5px 20px;
  background-image: linear-gradient(to right, #CC2E5D, #FF5858);
  border-radius: 10px;

  color: #FFF;
  font-size: 15px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;

}
.buttons{
  margin-top: 1rem;
} */

</style>
