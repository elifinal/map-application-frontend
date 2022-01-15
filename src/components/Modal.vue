<template>
<div id="#app">
      <div id="modal1">
    <b-modal v-if="showModal" ref="modalref" id="modal-1">
        <div class="modal-body">
        <div id="mapModal" ref="mapElement">
          <p>buraya map gelicek</p>
        </div>
        </div>
    </b-modal>
    </div>
</div>

</template>

<script>
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
/* eslint-disable */
export default {
  name: 'modal',
  data() {
    return {
      map2: null,
    };
  },
  props: {},
  methods: {
    createMap() {
      this.map2 = L.map('mapModal').setView([38.9637, 35.2433], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map2);

    },
    showModal(row) {
      debugger
      console.log('row geldi mi', row);  
      this.$refs.modalref.show();
      // setTimeout(() => this.createMap(), 2000);
    },
    hideModal() {
      this.$refs.modal.hide();
    },
    // createModal(row) {
    //   this.map2 = L.map('map2', {
    //     maptype: 'dreamy',
    //     poi: true,
    //     traffic: true,
    //   }).setView([38.9637, 35.2433], 6);
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   }).addTo(this.map2);
    //   if (row.place === 'Hastane') {
    //     if (row.type === 'marker') {
    //       const rev = [];
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.marker(latlngs).addTo(this.map).bindPopup('Hastane');
    //     } else if (row.type === 'circle') {
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.circle(latlngs, { radius: row.radius, color: 'red' }).addTo(this.map2).bindPopup('Hastane');
    //     } else if (row.type === 'rectangle') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.rectangle(lastPoints, { color: 'red' }).addTo(this.map2).bindPopup('Hastane');
    //     } else if (row.type === 'polygon') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.polygon(lastPoints, { color: 'red' }).addTo(this.map2).bindPopup('Hastane');
    //     } else if (row.type === 'polyline') {
    //       var latlngs = row.points;
    //       console.log('latlngs', latlngs);
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const point = row.points[i];

    //         lastPoints.push([point[1], point[0]]);
    //       }
    //       L.polyline(lastPoints, { color: 'red' }).addTo(this.map2).bindPopup('Hastane');
    //     }
    //   } else if (row.place === 'Market') {
    //     if (row.type === 'marker') {
    //       const rev = [];
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.marker(latlngs).addTo(this.map).bindPopup('Market');
    //     } else if (row.type === 'circle') {
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.circle(latlngs, { radius: row.radius, color: 'green' }).addTo(this.map2).bindPopup('Market');
    //     } else if (row.type === 'rectangle') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.rectangle(lastPoints, { color: 'green' }).addTo(this.map2).bindPopup('Market');
    //     } else if (row.type === 'polygon') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.polygon(lastPoints, { color: 'green' }).addTo(this.map2).bindPopup('Market');
    //     } else if (row.type === 'polyline') {
    //       var latlngs = row.points;
    //       console.log('latlngs', latlngs);
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const point = row.points[i];

    //         lastPoints.push([point[1], point[0]]);
    //       }
    //       L.polyline(lastPoints, { color: 'green' }).addTo(this.map2).bindPopup('Market');
    //     }
    //   } else if (row.place === 'Restorant') {
    //     if (row.type === 'marker') {
    //       const rev = [];
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.marker(latlngs).addTo(this.map).bindPopup('Restorant');
    //     } else if (row.type === 'circle') {
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.circle(latlngs, { radius: row.radius, color: 'purple' }).addTo(this.map2).bindPopup('Restorant');
    //     } else if (row.type === 'rectangle') {
    //       var latlngs = this.row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.rectangle(lastPoints, { color: 'purple' }).addTo(this.map2).bindPopup('Restorant');
    //     } else if (row.type === 'polygon') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.polygon(lastPoints, { color: 'purple' }).addTo(this.map2).bindPopup('Restorant');
    //     } else if (row.type === 'polyline') {
    //       var latlngs = row.points;
    //       console.log('latlngs', latlngs);
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const point = row.points[i];

    //         lastPoints.push([point[1], point[0]]);
    //       }
    //       L.polyline(lastPoints, { color: 'purple' }).addTo(this.map2).bindPopup('Restorant');
    //     }
    //   } else if (row.place === 'Okul') {
    //     if (row.type === 'marker') {
    //       const rev = [];
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.marker(latlngs).addTo(this.map).bindPopup('Okul');
    //     } else if (row.type === 'circle') {
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.circle(latlngs, { radius: row.radius, color: 'pink' }).addTo(this.map2).bindPopup('Okul');
    //     } else if (row.type === 'rectangle') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.rectangle(lastPoints, { color: 'pink' }).addTo(this.map2).bindPopup('Okul');
    //     } else if (row.type === 'polygon') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.polygon(lastPoints, { color: 'pink' }).addTo(this.map2).bindPopup('Okul');
    //     } else if (row.type === 'polyline') {
    //       var latlngs = row.points;
    //       console.log('latlngs', latlngs);
    //       const lastPoints = [];
    //       for (let i = row.points.length; i++;) {
    //         const point = row.points[i];

    //         lastPoints.push([point[1], point[0]]);
    //       }
    //       L.polyline(lastPoints, { color: 'pink' }).addTo(this.map2).bindPopup('Okul');
    //     }
    //   } else if (row.place === 'Benzinlik') {
    //     if (row.type === 'marker') {
    //       const rev = [];
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.marker(latlngs).addTo(this.map).bindPopup('Benzinlik');
    //     } else if (row.type === 'circle') {
    //       var latlngs = [row.points[1], row.points[0]];
    //       L.circle(latlngs, { radius: row.radius, color: 'blue' }).addTo(this.map2).bindPopup('Benzinlik');
    //     } else if (row.type === 'rectangle') {
    //       var latlngs = this.areas[k].points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.rectangle(lastPoints, { color: 'blue' }).addTo(this.map2).bindPopup('Benzinlik');
    //     } else if (row.type === 'polygon') {
    //       var latlngs = row.points;
    //       const lastPoints = [];
    //       for (let i = 0; i < row.points.length; i++) {
    //         const coords = row.points[i];
    //         const coordinates = [];

    //         for (let j = 0; j < coords.length; j++) {
    //           const point = coords[j];
    //           coordinates.push([point[1], point[0]]);
    //         }

    //         lastPoints.push(coordinates);
    //       }
    //       L.polygon(lastPoints, { color: 'blue' }).addTo(this.map2).bindPopup('Benzinlik');
    //     } else if (this.row.type === 'polyline') {
    //       var latlngs = this.row.points;
    //       console.log('latlngs', latlngs);
    //       const lastPoints = [];
    //       for (let i = 0; i < this.row.points.length; i++) {
    //         const point = this.row.points[i];

    //         lastPoints.push([point[1], point[0]]);
    //       }
    //       L.polyline(lastPoints, { color: 'blue' }).addTo(this.map2).bindPopup('Benzinlik');
    //     }
    //   }
    // },
  },
};
</script>

<style scoped>
#mapModal{
  width: 93%;
  height: 100%;
  position: absolute;
}
#modal1{
  position: absolute;
  z-index: 999;
  height: 100%;
  width: 100%;
}
.modal-body {
  height: 15rem;
  position: absolute;
  flex: 1 1 auto;
  padding: 1rem;
}

</style>
