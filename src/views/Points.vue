<template>
  <div id="map" ref="map">
    <div id="areaList" v-if="showList">
      <v-client-table
        :data = "tableData"
        :columns="columns"
        id="tableList"
        >
      <template slot="icons" slot-scope="{ row }">
      <button v-on:click="EditItem(row)">
        <span class="glyphicon glyphicon-pushpin"></span>
        <modal ref="modalref"> </modal>
      </button>
      </template>
      </v-client-table>
      <button value="Submit" class="btn" @click="newPoint">New Point</button>
    </div>
      <div class="contain" v-if="isShow">
          <div id="form">
            <form>
                <div class="paragraph">
                <p>Area Range:<br><input v-model="range" id="area_range"><br></p>
                 <v-select
                  v-model="selected"
                  :options = "places"
                  label="title"
                ></v-select>
                </div>
                <div class="buttons">
                <button value="Submit" class="btn" @click="submit">Save</button>
                <button value="cancel" class="btn" @click="cancel">Cancel</button>
                <button value="Point" class="btn" @click="newPoint">New Point</button>
                </div>
            </form>
          </div>
      </div>
       <button v-on:click.stop
       v-if="showArea" value="Point" id="allAreas" @click="allAreas">Show All Areas</button>
       <button v-if="areaNew" v-on:click.stop
        value="Point" id="btnArea" @click="newPoint">New Point</button>
  </div>
</template>

<script>
/* eslint-disable */

import '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios';
import modal from '../components/Modal.vue';

export default {
  data() {
    return { 
      columns: ['name', 'place', 'distance', 'icons'],
      tableData:[],
      map: null,
      layer: null,
      drawnItems: null,
      isShow: false,
      showList: false,
      range: 1000,
      selected: null,
      showArea: true,
      areaNew: false,
      datas: null,
      data: {
        place: null,
        range: null,
        lat: null,
        lng: null,
      },
      places: [
        { id: 1, title: 'Hastane' },
        { id: 2, title: 'Market' },
        { id: 3, title: 'Restorant' },
        { id: 4, title: 'Okul' },
        { id: 5, title: 'Benzinlik' },
        { id: 6, title: 'Diğer' },
      ],
      areas: null,
    };
  },
  components: {
    modal
  },
  mounted() {
    this.createMap();
    axios.get('http://127.0.0.1:8000/post/places/').then((resp) => {
      console.log('resp', resp.data);
      this.datas = resp.data;
      console.log('dataas', this.datas);
    });

 
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

      this.map.once('click', (e) => {
        this.isShow = true;
        this.showArea = false;
        console.log('click loc', e.latlng.lat);
        const point = [];
        point[0] = e.latlng.lat;
        point[1] = e.latlng.lng;
        this.data.lat = e.latlng.lat;
        this.data.lng = e.latlng.lng;
        console.log('point', point);
        L.marker(point).addTo(this.drawnItems);
      });
      let params = {};
      params = {
        draw: {
          circlemarker: false,
          circle: false,
          polygon: false,
          polyline: false,
          rectangle: false,
          marker: false,
        },
        edit: {
          featureGroup: this.drawnItems,
        },
      };

      new L.Control.Draw(params).addTo(this.map);
    },
    EditItem(row){
      console.log('clicked',row);
      this.$refs.modalref.showModal(row);
    },
    submit() {
      if (this.range == '') {
        this.$swal('Area range can not be empty');
      }else
      this.data.range = this.range;
 
      this.data.place = this.selected.id;
      console.log('data', this.data);
      this.isShow = false;
      this.showList = true,
      axios.put('http://127.0.0.1:8000/post/places/', { data: this.data }).then((Response) => {
        console.log(Response);
        this.areas = Response.data;
        this.tableData = Response.data;
        if(this.areas.length==0){
            this.$swal('Area Not Found')
            this.map.removeLayer(this.drawnItems);
            this.$refs.map.refresh();
        }
        console.log('areas', this.areas);
        this.Areas();
      }).catch((e) => console.log(e));
    //   this.Areas();
    this.show = true;
    },
    Areas() {
      for(let k=0; k<this.areas.length; k++) {
        if(this.areas[k].place === 'Hastane'){
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Hastane');
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'red' }).addTo(this.map).bindPopup('Hastane');
        }
        }else if(this.areas[k].place === 'Market'){
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Market');
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        }
        }else if (this.areas[k].place === 'Restorant'){
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Restorant');
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        }
        }else if (this.areas[k].place === 'Okul') {
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Okul');
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        }
        }else if (this.areas[k].place === 'Benzinlik') {
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        }
        }
        
      }      
    },
    allAreas(){
      this.showArea = false;
      this.areaNew = true;
      for(let k=0; k<this.datas.length; k++) {
        if(this.datas[k].place === 'Hastane'){
          if (this.datas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Hastane');
        } else if (this.datas[k].type === 'circle') {
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.circle(latlngs, { radius: this.datas[k].radius, color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.datas[k].type === 'rectangle') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.datas[k].type === 'polygon') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'red' }).addTo(this.map).bindPopup('Hastane');
        } else if (this.datas[k].type === 'polyline') {
            var latlngs = this.datas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const point = this.datas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'red' }).addTo(this.map);
        }
        }else if(this.datas[k].place === 'Market'){
          if (this.datas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Market');
        } else if (this.datas[k].type === 'circle') {
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.circle(latlngs, { radius: this.datas[k].radius, color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.datas[k].type === 'rectangle') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.datas[k].type === 'polygon') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        } else if (this.datas[k].type === 'polyline') {
            var latlngs = this.datas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const point = this.datas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'green' }).addTo(this.map).bindPopup('Market');
        }
        }else if (this.datas[k].place === 'Restorant'){
          if (this.datas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Restorant');
        } else if (this.datas[k].type === 'circle') {
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.circle(latlngs, { radius: this.datas[k].radius, color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.datas[k].type === 'rectangle') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.datas[k].type === 'polygon') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        } else if (this.datas[k].type === 'polyline') {
            var latlngs = this.datas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const point = this.datas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'purple' }).addTo(this.map).bindPopup('Restorant');
        }
        }else if (this.datas[k].place === 'Okul') {
          if (this.datas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Okul');
        } else if (this.datas[k].type === 'circle') {
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.circle(latlngs, { radius: this.datas[k].radius, color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.datas[k].type === 'rectangle') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.datas[k].type === 'polygon') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        } else if (this.datas[k].type === 'polyline') {
            var latlngs = this.datas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const point = this.datas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'pink' }).addTo(this.map).bindPopup('Okul');
        }
        }else if (this.datas[k].place === 'Benzinlik') {
          if (this.datas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.marker(latlngs).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.datas[k].type === 'circle') {
            var latlngs = [this.datas[k].points[1], this.datas[k].points[0]];
            L.circle(latlngs, { radius: this.datas[k].radius, color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.datas[k].type === 'rectangle') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.datas[k].type === 'polygon') {
            var latlngs = this.datas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const coords = this.datas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        } else if (this.datas[k].type === 'polyline') {
            var latlngs = this.datas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.datas[k].points.length; i++) {
            const point = this.datas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'blue' }).addTo(this.map).bindPopup('Benzinlik');
        }
        }
      }      
    },
    cancel() {
      this.isShow = false;
      this.range = null;
      this.place = null;
      this.map.removeLayer(this.drawnItems);
      this.$router.go();
    },
    newPoint(){
      this.$router.go();
    },
  },

};
</script>

<style>
#map{
width: 100%;
height: 100%;
}
#form{
position: absolute;
top: 0;
right: 4rem;
height: 2rem;
z-index: 999;
}
#areaList{
position: absolute;
display: inline;
background: rgba(0, 128, 128, 0.75) ;
padding: 150px 20px;
box-sizing: border-box;
top: 0;
margin-top: 0rem;
right: 0rem;
height: 2rem;
z-index: 999;
}
#tableList{
  margin-top: -14rem;
}
.contain {
  position: absolute;
  background: rgba(0, 128, 128, 0.75) ;
  padding: 100px 175px;
  box-sizing: border-box;
  right: 0rem;
  height: 2rem;
  z-index: 999;
}
.paragraph {
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 2rem;
}
#allAreas{
  position: absolute;
  left: 0;
  bottom: 0rem;
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

  z-index: 999;

}
#btnArea{
  position: absolute;
  left: 0rem;
  bottom: 0rem;
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

}
</style>
for(let k=0; k<this.areas.length; k++){
          if (this.areas[k].type === 'marker') {
            const rev = [];
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.marker(latlngs).addTo(this.map);
        } else if (this.areas[k].type === 'circle') {
            var latlngs = [this.areas[k].points[1], this.areas[k].points[0]];
            L.circle(latlngs, { radius: this.areas[k].radius, color: 'red' }).addTo(this.map);
        } else if (this.areas[k].type === 'rectangle') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.rectangle(lastPoints, { color: 'purple' }).addTo(this.map);
        } else if (this.areas[k].type === 'polygon') {
            var latlngs = this.areas[k].points;
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const coords = this.areas[k].points[i];
            const coordinates = [];

            for (let j = 0; j < coords.length; j++) {
                const point = coords[j];
                coordinates.push([point[1], point[0]]);
            }

            lastPoints.push(coordinates);
            }
            L.polygon(lastPoints, { color: 'green' }).addTo(this.map);
        } else if (this.areas[k].type === 'polyline') {
            var latlngs = this.areas[k].points;
            console.log('latlngs', latlngs);
            const lastPoints = [];
            for (let i = 0; i < this.areas[k].points.length; i++) {
            const point = this.areas[k].points[i];

            lastPoints.push([point[1], point[0]]);
            }
            L.polyline(lastPoints, { color: 'red' }).addTo(this.map);
        }
      }  