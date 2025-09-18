import { useEffect } from "react";

export function useAutoHideScrollbar(ref, delay = 300) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    let timer;
    
    const onScroll = () => {
      el.classList.add("is-scrolling");
      clearTimeout(timer);
      timer = setTimeout(() => {
        el.classList.remove("is-scrolling");
      }, delay);
    };
    
    el.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [ref, delay]);
}