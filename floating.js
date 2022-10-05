// Use Draggable Directive
Vue.directive("draggable", {
    bind: (elem, bindings) => {
  
      // Initialize BindToParent flag
          // default false
      elem.dataset.BindToParent =
        bindings.value !== undefined && bindings.value.BindToParent !== undefined
          ? bindings.value.BindToParent
                  : false;
  
          // Initialize stickToEdge flag
          // default false
      elem.dataset.stickToEdge =
        bindings.value !== undefined && bindings.value.stickToEdge !== undefined
          ? bindings.value.stickToEdge
                  : false;
  
      // Initialize stickToEdgeY axis flag
          // Only applicable if stick to edge is true
          // default true
      elem.dataset.stickToEdgeY =
        bindings.value !== undefined && bindings.value.stickToEdgeY !== undefined
          ? bindings.value.stickToEdgeY
                  : true;
  
      // Initialize stickToEdgeX axis flag
          // Only applicable if stick to edge is true
          // default true
      elem.dataset.stickToEdgeX =
        bindings.value !== undefined && bindings.value.stickToEdgeX !== undefined
          ? bindings.value.stickToEdgeX
                  : true;
                  
          // Initialize distance from edge
          // Only applicable if stick to edge is true
          // default is 0px
          let edgeGap =
          bindings.value !== undefined && bindings.value.edgeGap !== undefined
              ? bindings.value.edgeGap
              : 0;
  
      // Initialize dragging flag
          elem.dataset.isDragging = false;
  
          // Initialize class for transitions
          elem.classList.add('drag-released');
  
          // Initialize element position
          // Default 0, 0
          elem.style.top = bindings.value !== undefined && bindings.value.initTop !== undefined
          ? bindings.value.initTop
          : '0px';
          elem.style.left = bindings.value !== undefined && bindings.value.initLeft !== undefined
          ? bindings.value.initLeft
          : '0px';
  
      // Add mouseDown Events
      elem.addEventListener("mousedown", event => {
              // Only trigger when left click
              if (event.button != 0) {
                  return false;
              }
        // Prevent default browser event from triggering
        event.preventDefault();
        // Remove 'drag-released' class
        elem.classList.remove("drag-released");
        // Add Mouse Up Event
        document.addEventListener("mouseup", mouseUp);
        // If the mousedown event lasts for more than 100ms, consider it as a drag event
        window.$dragDelay = setTimeout(() => {
          // Set dragging flag to true
          elem.dataset.isDragging = true;
          // Add mouse move event
          document.addEventListener("mousemove", mouseMove);
          // Trigger onDragStart function
          if (
            bindings.value !== undefined &&
            bindings.value.onDragStart !== undefined
          ) {
            bindings.value.onDragStart();
          }
        }, 100);
      });
  
      // Track mouse movement within the site
      let mouseMove = event => {
        // Prevent default browser event from triggering
              event.preventDefault();
      
              // Get Mouse Position
              let boundRect = elem.parentElement.getBoundingClientRect();
              let mouseY = elem.dataset.BindToParent == 'true' ? (event.y - boundRect.top) : event.y;
              let mouseX = elem.dataset.BindToParent == 'true' ? (event.x - boundRect.left) : event.x;
              let boxHeight = elem.dataset.BindToParent == 'true' ? elem.parentElement.offsetHeight : window.innerHeight;
              let boxWidth = elem.dataset.BindToParent == 'true' ? elem.parentElement.offsetWidth : window.innerWidth;
        let posY = 0;
              let posX = 0;
  
        // Prevent dragging above of bound container
        if (mouseY >= elem.offsetHeight / 2) {
          posY = mouseY - elem.offsetHeight / 2;
        }
        // Prevent dragging below of bound container
        if (mouseY >= boxHeight - elem.offsetHeight / 2) {
          posY = boxHeight - elem.offsetHeight;
        }
        // Prevent dragging left of bound container
        if (mouseX >= elem.offsetWidth / 2) {
          posX = mouseX - elem.offsetWidth / 2;
        }
        // Prevent dragging right of bound container
        if (mouseX >= boxWidth - elem.offsetWidth / 2) {
          posX = boxWidth - elem.offsetWidth;
              }
  
        // Set element position on cursor position
        elem.style.top = posY + "px";
        elem.style.left = posX + "px";
  
        // Trigger whileDragging function
        if (
          bindings.value !== undefined &&
          bindings.value.whileDragging !== undefined
        ) {
          bindings.value.whileDragging(posX, posY);
        }
      };
  
      // Add mouseUp Event
      let mouseUp = event => {
        // Prevent default browser event from triggering
              event.preventDefault();
              
              let boxHeight = elem.dataset.BindToParent == 'true' ? elem.parentElement.offsetHeight : window.innerHeight;
              let boxWidth = elem.dataset.BindToParent == 'true' ? elem.parentElement.offsetWidth : window.innerWidth;
  
        // End Drag event
        if (elem.dataset.isDragging === "true") {
          elem.dataset.isDragging = false;
  
          // Add 'drag-released' class after drag event
          elem.classList.add("drag-released");
  
          // If Draggable Element is Stick to Edge
          if (elem.dataset.stickToEdge === "true") {
            let posY =
              parseInt(elem.style.top.replace("px", "")) + elem.offsetHeight / 2;
            let posX =
              parseInt(elem.style.left.replace("px", "")) + elem.offsetWidth / 2;
            let edgeY = posY;
                      let edgeX = posX;
                      let edgePosX = '';
                      let edgePosY = '';
  
                      if (elem.dataset.stickToEdgeY == 'true') {
                          // calculate distance from bottom edge
                          if (posY > boxHeight / 2) {
                              edgeY = boxHeight - (posY + elem.offsetHeight / 2);
                              posY = boxHeight - elem.offsetHeight - edgeGap;
                              edgePosY = 'bottom';
                          }
                          // calculate distance from top edge
                          else {
                              edgeY = posY - elem.offsetHeight / 2;
                              posY = edgeGap;
                              edgePosY = 'top';
                          }
                      }
  
                      if (elem.dataset.stickToEdgeX == 'true') {
                          // calculate distance from right edge
                          if (posX > boxWidth / 2) {
                              edgeX = boxWidth - (posX + elem.offsetWidth / 2);
                              posX = boxWidth - elem.offsetWidth - edgeGap;
                              edgePosX = 'right';
                          }
                          // calculate distance from left edge
                          else {
                              edgeX = posX - elem.offsetWidth / 2;
                              posX = edgeGap;
                              edgePosX = 'left';
                          }
                      }
  
                      // clear stick position class
                      elem.classList.remove('drag-stuck-top');
                      elem.classList.remove('drag-stuck-bottom');
                      elem.classList.remove('drag-stuck-left');
                      elem.classList.remove('drag-stuck-right');
                      // stick element to nearest edge
            if (edgeY < edgeX && elem.dataset.stickToEdgeY == 'true') {
                          elem.style.top = posY + "px";
                          elem.classList.add('drag-stuck-' + edgePosY);
                      }
                      else if (elem.dataset.stickToEdgeX == 'true') {
              elem.style.left = posX + "px";
                          elem.classList.add('drag-stuck-' + edgePosX);
            }
          }
  
          // Trigger onDragEnd function
          if (
            bindings.value !== undefined &&
            bindings.value.onDragEnd !== undefined
          ) {
            bindings.value.onDragEnd();
          }
  
          // Remove mouseUp and mouseMove events
          document.removeEventListener("mousemove", mouseMove);
          document.removeEventListener("mouseup", mouseUp);
        }
        // Event is a click
        else {
          // Cancel Drag sequence
          clearTimeout(window.$dragDelay);
          // Remove mouseUp event
          document.removeEventListener("mouseup", mouseUp);
          // Trigger onClick function
          if (
            bindings.value !== undefined &&
            bindings.value.onClick !== undefined
          ) {
            bindings.value.onClick();
          }
        }
      };
    }
  });
  
  // Create Chathead Component
  Vue.component("chathead", {
    template: `
          <div id="chathead"
              v-draggable="draggableOptions"
              :class="{open : isOpen, 'drag-released' : !isOpen}">
          </div>
      `,
    data() {
      return {
        draggableOptions: {
          stickToEdge: true,
          stickToEdgeY: false,
          BindToParent: true,
          edgeGap: 0,
          onClick: this.toggleChatbox
        }
      };
    },
    props: ["isOpen"],
    methods: {
      toggleChatbox() {
        this.$parent.toggleChatbox();
      }
    }
  });
  
  
  // Initialize Vue App
  new Vue({
    el: "#app",
    data: () => {
      return {
        isOpen: false
      };
    },
    methods: {
      toggleChatbox() {
        this.isOpen = !this.isOpen;
      }
    }
  });