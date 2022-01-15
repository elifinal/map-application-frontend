<template>
<div class="list">
    <v-server-table
    ref="Table"
  :options="options"
  :columns="columns">
   <template slot="icons" slot-scope="{ row }">
     <button v-on:click="DeleteItem(row.id)">
       <span class="glyphicon glyphicon-remove"></span>
     </button>
     <button v-on:click="EditItem(row)">
       <span class="glyphicon glyphicon-pencil"></span>
     </button>
      <button v-on:click="scopeItem(row)">
        <span class="glyphicon glyphicon-pushpin"></span>
      </button>
   </template>
  </v-server-table>
  <modal ref="modalref"> </modal>

</div>

    <!-- <div class="list">
      <div id="app">
  <v-app>
        <v-data-table striped hover :items="items">
        </v-data-table>
  </v-app>
      </div>
    </div> -->
</template>

<script>
import axios from 'axios';
import modal from '../components/Modal.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import { component } from 'vue/types/umd';

export default {
  data() {
    return {
      id: '',
      columns: ['name', 'desc', 'type', 'points', 'radius', 'place', 'icons'],
      // tableData: [],
      options: {
        perPage: 10,

        // axios.get('http://127.0.0.1:8000/post/posts',{params:data},{headers:{}})
        requestFunction(data) {
          console.log('resp', data);
          const resp = axios.get('http://127.0.0.1:8000/post/posts', { params: data }).catch((e) => console.log(e));
          return resp;
        },
        responseAdapter(resp) {
          return {
            data: resp.data.data,
            count: resp.data.count,
          };
        },
        pageSize: 5,
        perPageValues: [10],
        pagination: {
          edge: false,
          dropdown: false,
        },
        perPageDropdown: null,
        perPageDropdownEnabled: true,
        filterable: true,
      },
    };
  },
  component: {
    modal,
  },

  mounted() {

  },
  methods: {
    getReq() {
      axios.get('http://127.0.0.1:8000/post/posts')
        .then((response) => {
          console.log(response);
          this.items = response.data;
        })
        .catch((e) => console.log(e));
    },
    scopeItem(row) {
      console.log('clicked', row);
      debugger;
      this.$refs.modalref.showModal(row);
    },
    DeleteItem(id) {
      console.log('id', id);
      /* eslint-disable */
      axios.delete('http://127.0.0.1:8000/post/posts', { params: { id: id } })
        .then((res) => {
          console.log(res);
          this.$swal('Area Deleted');
          this.$refs.Table.refresh();
        })
        .catch((e) => console.log(e));
    },
    EditItem(row) {
      console.log('sdf',row);
      this.$router.push({ name: 'mymap', params: { row } });
    },
  },

};
</script>

<style>
.list{
  overflow-y: scroll;
  display: flex;
  box-sizing: border-box;
  height: 1000px;
  display: block;
  padding: 20px;
  font-size: 1.5em;
}
/* .list {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 40px;
    color: rgb(167, 167, 167);
    font-weight: 600;
} */
</style>
