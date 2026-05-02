<template>
  <nav>
    <RouterLink to="/" class="nav-logo"><span class="material-symbols-rounded filled">home</span></RouterLink>
    <RouterLink to="/capacity" class="nav-link">Capacity</RouterLink>  <!--today and future capacities-->
    <RouterLink to="/tasks" class="nav-link">Tasks</RouterLink>

    <!-- User input -->
    <RouterLink to="/mood" class="nav-link">Mood</RouterLink>
    <RouterLink to="/sleep" class="nav-link">Sleep</RouterLink>
    <RouterLink to="/medication" class="nav-link">Medication</RouterLink>
    <RouterLink to="/intake" class="nav-link">Intake</RouterLink>

    <!-- History -->
    <RouterLink to="/history" class="nav-link">History</RouterLink>
  </nav>
</template>
