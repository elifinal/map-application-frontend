<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<!-- <nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">WebSiteName</a>
    </div>
    <div class="navbar nav">
    <ul class="nav navbar-nav">
      <li class="active"><a href="#">Home</a></li>
      <li><a href="#">Page 1</a></li>
      <li><a href="#">Page 2</a></li>
    </ul>
    </div>
    <form class="navbar-form navbar-left">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Search" name="search">
        <div class="input-group-btn">
          <button class="btn btn-default" type="submit">
            <i class="glyphicon glyphicon-search"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</nav> -->
<!-- <nav class="navbar navbar-default">
<div class="container">
   <div class="navbar-header">
    <a href="#" class="navbar-brand">Map</a>
  </div>
  <ul class="nav navbar-nav">
<li><a href="#">item one</a></li>
<li><a href="#">item two</a></li>
  </ul>
  <ul>
    <li><a href="#">on the right</a></li>
  </ul>
</div>

</nav> -->
<script>
import 'bootstrap/dist/css/bootstrap.min.css';
// import Home from './views/Home.vue';

export default {
  name: 'App',
  components: {
    // Home,
  },
};

</script>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
}

</style>
