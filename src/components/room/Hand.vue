<template>
  <div class="flex my-5 w-1/2 mx-auto justify-around">
    <div
      class="flex h-150px w-100px border border-gray-300 rounded-lg font-bold text-3xl justify-center items-center cursor-pointer"
      v-for="card in hand"
      :key="card.value"
      @click="handleCardClick(card)"
    >
      {{ card.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hand',
  components: {},
  // props: ['hand'],
  emits: [],
  data() {
    return {
      hand: [{ value: 5 }, { value: 66 }, { value: 98 }],
    };
  },
  methods: {
    handleCardClick(card) {
      console.log(`[DEBUG] Card ${card.value} clicked`);
    },
  },
};
</script>
