<template>
  <div
    class="bg-black bg-opacity-50 w-full h-full fixed top-0 left-0 z-10"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded p-8 mx-auto mt-48 w-96">
      <h2 class="text-xl mb-5">Settings</h2>
      <form class="grid grid-cols-2 items-center">
        <label class="">Wide Board Layout</label>
        <input type="checkbox" />
        <label class="">Advanced Settings</label>
        <input type="checkbox" />
      </form>
      <button
        class="block btn bg-blue-600 mx-auto mt-5"
        @click.prevent="$emit('save')"
      >
        Save changes
      </button>
    </div>
  </div>
</template>