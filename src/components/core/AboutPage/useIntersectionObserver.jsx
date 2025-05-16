import { useRef, useState } from 'react';

/**
 * Custom React hook to observe an element's visibility within the viewport.
 * @param {IntersectionObserverInit} options - Configuration for the IntersectionObserver (root, rootMargin, threshold).
 * @returns {[boolean, (element: HTMLElement|null) => void]}
 *   - isIntersecting: whether the target element is currently visible.
 *   - setElement: ref callback to attach to the target element.
 */
const useIntersectionObserver = (options) => {
  // Track visibility state of the observed element
  const [isIntersecting, setIsIntersecting] = useState(false);
  // Ref to hold the IntersectionObserver instance between renders
  const observerRef = useRef(null);

  /**
   * Ref callback to attach/disconnect the observer to a DOM element.
   * @param {HTMLElement|null} element - The DOM node to observe (or null to disconnect).
   */
  const setElement = (element) => {
    // Disconnect previous observer to avoid memory leaks and duplicate callbacks
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      // Create a new observer with the provided options
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // Update state when intersection status changes
          setIsIntersecting(entry.isIntersecting);
        },
        { ...options }
      );

      // Start observing the new element
      observerRef.current.observe(element);
    }
  };

  // Return current visibility status and the ref callback
  return [isIntersecting, setElement];
};

export default useIntersectionObserver;
