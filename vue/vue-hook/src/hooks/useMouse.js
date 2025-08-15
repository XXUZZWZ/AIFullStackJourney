import { ref, onMounted, onUnmounted } from "vue";

export  function useMouse() {
  const x = ref(0);
  const y = ref(0);

  const updataMousePosition = (event) => {
    x.value = event.clientX;
    y.value = event.clientY;
  };
  onMounted(() => {
    window.addEventListener("mousemove", updataMousePosition);
  });
  onUnmounted(() => {
    window.removeEventListener("mousemove", updataMousePosition);
  });
  return { x, y };
}
