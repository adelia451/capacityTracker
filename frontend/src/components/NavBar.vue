<template>
  <nav>
    <RouterLink to="/" class="nav-logo">
      <span class="material-symbols-rounded filled">home</span>
    </RouterLink>

    <RouterLink to="/capacity"  class="nav-link">Capacity</RouterLink>
    <RouterLink to="/tasks"     class="nav-link">Tasks</RouterLink>

    <!-- User input -->
    <RouterLink to="/rest-mood" class="nav-link">Rest & Mood</RouterLink>
    <RouterLink to="/intake"    class="nav-link">Intake</RouterLink>

    <!-- History -->
    <RouterLink to="/history"   class="nav-link">History</RouterLink>
  </nav>
</template>