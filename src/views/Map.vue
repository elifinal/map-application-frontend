<template>
    <div id="map" ref="MapPage" style="height:100%;">
      <div class="contain" v-if="isShow">
          <div id="form">
            <form>
                <div class="paragraph">
                <p>Description:<br><input v-model="input_desc" id="input_desc"><br></p>
                <p>Name:<br><input v-model="input_name" type="text" id="input_name"><br></p>
                 <v-select
                  v-model="selected"
                  :options = "places"
                  label="title"
                ></v-select>
                </div>
                <hr>
                <div class="buttons">
                <button value="Submit" class="btn" @click="submit">Save</button>
                <button value="cancel" class="btn" @click="cancel">Cancel</button>
                </div>
            </form>
    <!-- <router-view/> -->
          </div>
      </div>

    </div>

</template>

<script>
// @ is an alias to /src
import '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
// import { ref } from 'vue';
// import LDraw from 'leaflet-draw';
// import * as L from 'leaflet';
import 'leaflet-draw';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-select/dist/vue-select.css';
import axios from 'axios';
// import swal from 'sweetalert2';
// import Sidebar from '../components/Sidebar.vue';
// import vmodal from 'vue-js-modal';

export default {
//   name: 'Home',
  data() {
    return {
      datas: {
        id: null,
        points: '',
        type: '',
        name: '',
        desc: '',
        radius: '',
        places: null,
      },
      places: [
        { id: 1, title: 'Hastane' },
        { id: 2, title: 'Market' },
        { id: 3, title: 'Restorant' },
        { id: 4, title: 'Okul' },
        { id: 5, title: 'Benzinlik' },
      ],
      position: null,
      coords: null,
      map: null,
      editableLayers: null,
      layer: null,
      MyCustomMarker: null,
      drawnItems: null,
      // datas: null,
      // showModal: true,
      isShow: false,
      input_desc: '',
      input_name: '',
      selected: '',
    };
  },
  components: {
    // Sidebar,
  },
  mounted() {
    // this.createFormPopup();
    /* eslint-disable */
    console.log('router params', this.$route.params);
    if (this.$route.params && this.$route.params.row) {
      const { row } = this.$route.params;
      console.log('row', row.radius);
      this.datas.radius = row.radius;
      // this.datas.locations = row.locations;
      this.datas.type = row.type;
      this.datas.id = row.id;
      this.input_name = row.name;
      this.input_desc = row.desc;
      this.datas.name = row.name;
      this.datas.desc = row.desc;
      this.datas.points = row.points;
      this.isShow = true;
      this.createMap();
      this.createEvent();
      console.log('datas mounted', this.datas);
      this.Areas();
    } else {
      this.createMap();
      this.createEvent();
    }
  },
  methods: {
    createMap() {
      this.map = L.map('map', {
        maptype: 'dreamy',
        poi: true,
        traffic: true,
      }).setView([38.9637, 35.2433], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      this.drawnItems = L.featureGroup().addTo(this.map);

      // this.map.on('click', (e) => {
      //   console.log('click loc', e.latlng.lat)
      //   var point = []
      //   point[0] = e.latlng.lat
      //   point[1] = e.latlng.lng
      //   console.log('point', point)

      //   L.marker(point).addTo(this.drawnItems)

      //   axios.post

      // })

      let params = {};
      if (this.datas.id !== null) {
        params.edit = {
          featureGroup: this.drawnItems,
        };
        params.draw = false;
      } else {
        params = {
          draw: {
            circlemarker: false,
            circle: {
              shapeOptions: {
                color: 'red',
              },
            },
            polygon: {
              shapeOptions: {
                color: 'green',
              },
            },
            polyline: {
              shapeOptions: {
                color: 'red',
              },
            },
            rectangle: {
              shapeOptions: {
                color: 'purple',
              },
            },

          },
          edit: {
            featureGroup: this.drawnItems,
          },
        };
      }
      new L.Control.Draw(params).addTo(this.map);
      this.map.on(L.Draw.Event.EDITED, (e) => {
        const { layers } = e;
        layers.eachLayer((layer) => {
          this.datas.points = layer.toGeoJSON().geometry.coordinates;
          this.datas.radius = layer.options.radius ? layer.options.radius : null;
        });
      });
    },
    createEvent() {
      this.map.on(L.Draw.Event.CREATED, (e) => {
        this.drawnItems.addLayer(e.layer);
        // e.layer.addTo(this.drawnItems);
        this.datas.type = e.layerType;
        console.log(e);
        // this.showModal();
        // this.$refs.modal.show();
        this.createFormPopup();
        this.drawnItems.eachLayer((layer) => {
          // const geojson = JSON.stringify(layer.toGeoJSON().geometry);
          // console.log(geojson);
          this.datas.locations = layer.toGeoJSON().geometry.coordinates;
          this.datas.radius = layer.options.radius ? layer.options.radius : null;
          console.log('drawnItems', this.datas);
        });
      });
      // this.map.on(L.Draw.Event.EDITED, (e) => {
      //   console.log('e', e);
      // });
    },
    createDelete() {
      for (const i in this.map._layers) {
        if (this.map._layers[i]._path !== undefined) {
          this.map.removeLayer(this.map._layers[i]);
        }
      }
      console.log(this.map._layers);
      this.createEvent();
    },

    submit() {
      this.datas.name = this.input_name;
      this.datas.desc = this.input_desc;
      this.datas.places = this.selected.id;
      console.log(this.datas);
      if (this.input_name == '') {
        this.$swal('Area name can not be empty');
      } else if (!this.datas.id) {
        axios.post('http://127.0.0.1:8000/post/save/', { data: this.datas }).then((Response) => {
          console.log(Response);
          this.$swal('Area Saved');
        })
          .catch((e) => console.log(e));
      } else {
        console.log('put data', this.datas);
        axios.put('http://127.0.0.1:8000/post/save/', { data: this.datas }).then((Response) => {

        }).catch((e) => console.log(e));
        this.$swal('Area Edited');
        this.$router.push({ name: 'mylist' });
      }
      // if(this.datas.id) {
      //   axios.put('http://127.0.0.1:8000/post/save/', { data: this.datas }).then((response) => {

      //   }).catch((e) => console.log(e))
      // }
      this.isShow = false;
      this.input_desc = '';
      this.input_name = '';
      this.createDelete();
      this.createSaved();
    },

    Areas() {
      if (this.datas.type === 'marker') {
        const rev = [];
        var latlngs = [this.datas.points[1], this.datas.points[0]];
        L.marker(latlngs).addTo(this.drawnItems);
      } else if (this.datas.type === 'circle') {
        var latlngs = [this.datas.points[1], this.datas.points[0]];
        L.circle(latlngs, { radius: this.datas.radius, color: 'red' }).addTo(this.drawnItems);
      } else if (this.datas.type === 'rectangle') {
        var latlngs = this.datas.points;
        const lastPoints = [];
        for (let i = 0; i < this.datas.points.length; i++) {
          const coords = this.datas.points[i];
          const coordinates = [];

          for (let j = 0; j < coords.length; j++) {
            const point = coords[j];
            coordinates.push([point[1], point[0]]);
          }

          lastPoints.push(coordinates);
        }
        L.rectangle(lastPoints, { color: 'pink' }).addTo(this.drawnItems);
      } else if (this.datas.type === 'polygon') {
        var latlngs = this.datas.points;
        const lastPoints = [];
        for (let i = 0; i < this.datas.points.length; i++) {
          const coords = this.datas.points[i];
          const coordinates = [];

          for (let j = 0; j < coords.length; j++) {
            const point = coords[j];
            coordinates.push([point[1], point[0]]);
          }

          lastPoints.push(coordinates);
        }
        L.polygon(lastPoints, { color: 'green' }).addTo(this.drawnItems);
      } else if (this.datas.type === 'polyline') {
        var latlngs = this.datas.points;
        console.log('latlngs', latlngs);
        const lastPoints = [];
        for (let i = 0; i < this.datas.points.length; i++) {
          const point = this.datas.points[i];

          lastPoints.push([point[1], point[0]]);
        }
        L.polyline(lastPoints, { color: 'red' }).addTo(this.drawnItems);
      }
    },
    cancel() {
      this.isShow = false;
      this.input_desc = '';
      this.input_name = '';
      this.createDelete();
      this.$swal('Changes Cancelled')
      this.$router.push({ name: 'mylist' });

    },

    createSaved() {
      const popupcontent = 'Area Saved';
      this.drawnItems.bindPopup(popupcontent).openPopup();
    },

    createFormPopup() {
      this.isShow = true;
    },
  },
};
</script>

<style scoped>
#map{
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
.contain {
  position: absolute;
  background: rgba(0, 128, 128, 0.3) ;
  padding: 125px 175px;
  box-sizing: border-box;
  right: 5rem;
  height: 2rem;
  z-index: 999;
}
.paragraph {
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 2rem;
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

}
</style>
