(function (global, factory) {


     typeof exports === 'object' && typeof module.exports !== 'undefined' ? module.exports = factory() :
     (global = global || self, global.Moedal = factory());
     


}(this, function () {
     

     var instance;

     function Moedal() {
          
          this.start;
          this.moedal = null;
          this.moedalOverlay = null;
     
          var defaults = {
               content: arguments[0].content,
               triggerEl: arguments[0].triggerEl,
               duration: 200,
               minHeight: 400,
               minWidth: 600,
               closeButton: false,
               classes: {
                    overlay: 'moedal-overlay',
                    moedal: 'moedal'
               },
               showMode: 'drop'
          }
   
          this.options = extend(defaults, arguments[0]);
     }

     function chooseAnimation(type) {
     
          if (type == 'fadeIn' || 'drop' || 'swing') {
         
               kickOffAnim.call(this, type)
          }
          else {
               throw new Error('No such animation of type: ' + '"' + type + '"' + '. Available types: "fadeIn", "drop" ')
          }
     }

     function setStyle(el, prop, val) {
          for (var i = 0; i < el.length; i++) {
               el[i].style[prop] = val; 
          }
     }

     function kickOffAnim(type) {
          var self = this;
          if (type == 'fadeIn') {
               animationBridge.call(this, function (timestamp, start, duration) {

                    setStyle([self.moedal, self.moedalOverlay], 'opacity', Math.min(1, (timestamp - start) / duration))

                    if ((start + duration) > timestamp) {
                         setStyle([self.moedal, self.moedalOverlay], 'zIndex', 99);
                         setStyle([self.moedal, self.moedalOverlay],'visibility', 'visible');
                    }
               })
          } else if (type == 'drop') {
               setStyle([self.moedal], 'transform', 'translateY(-200%)')
               setStyle([self.moedal], 'opacity', 1)
               animationBridge.call(this, function (timestamp, start, duration) {
                    
        
                    const fraction = ((duration + start - timestamp) / duration)
                    console.log(fraction)
                    setStyle([self.moedal], 'transform', `translate(-50%, -${50 + (200 * fraction)}%)`);
                   
                    setStyle([self.moedalOverlay], 'opacity', Math.min(1, (timestamp - start) / duration))

                    if ((start + duration) > timestamp) {
                         setStyle([self.moedal, self.moedalOverlay], 'zIndex', 99);
                         setStyle([self.moedal, self.moedalOverlay],'visibility', 'visible');
                    }
               })

             

          }
     }

     function animationBridge(cb) {

          var start;
          var duration = this.options.duration
          
          function animate(timestamp) {
               if (!start) {
                    start = timestamp
               }
               const elapsed = timestamp - start;

               cb(timestamp, start, duration)

               if (elapsed < duration) {
                   
                    window.requestAnimationFrame(animate);
               }
          }

          window.requestAnimationFrame(animate);

     }

     function extend(to, from) {
          for (var prop in from) {
               to[prop] = from[prop]
          }
          return to
     }

     Moedal.prototype.show = function () {
          

          // startTransition.call(this, this.options.duration, 'in')

          chooseAnimation.call(this, this.options.showMode)
     }
      
     Moedal.prototype.open = function (e) {
          if (!instance) {
               return init.call(this);     
          }
         this.show()
     }

     Moedal.prototype.close = function () {
          startTransition.call(this, this.options.duration, 'out')
     }

     

     // function startTransition( duration, direction) {
          
     //      var self = this;
     //      var start;
     //      function animateIn(timestamp) {
     //           if (!start) {
     //                start = timestamp
     //           }
     //           const elapsed = timestamp - start;
              
     //           self.moedal.style.opacity = Math.min(1, (timestamp - start) / duration);
              
     //           self.moedalOverlay.style.opacity = Math.min(1, (timestamp - start) / duration) ;
               
     //           if (elapsed < duration) {
                   
     //                window.requestAnimationFrame( animateIn);
     //           }
               
     //           if ((start + duration)  > timestamp) {
     //                self.moedal.style.zIndex = 1;
     //                self.moedal.style.visibility = 'visible';

     //                self.moedalOverlay.style.zIndex = 1;
     //                self.moedalOverlay.style.visibility = 'visible'

     //           }
                   
     //      }

     //      function animateOut(timestamp) {
     //           if (!start) {
     //                start = timestamp
     //                console.log(self)
     //           }
     //           const elapsed = timestamp - start;
              
     //           self.moedal.style.opacity = Math.max(0, 1 - ((timestamp - start) / duration));
              
     //           self.moedalOverlay.style.opacity = Math.max(0, 1 - (  (timestamp - start) / duration)) ;
               
     

     //           if (elapsed < duration) {
                   
     //                window.requestAnimationFrame( animateOut);
     //           }
               
     //           if (timestamp > (start + duration)) {
                    
     //                self.moedal.style.zIndex = -1;
     //                self.moedal.style.visibility = 'hidden';
     //                self.moedalOverlay.style.zIndex = -1;
                
     //                self.moedalOverlay.style.visibility = 'hidden';

     //           }
                   
     //      }
          
     //      if (direction == 'out') {
     //        return window.requestAnimationFrame(animateOut);
     //      } 

     //      return window.requestAnimationFrame(animateIn);

         
        
     // }
     
     function init() {

          var fragment = document.createDocumentFragment();
          var container = document.createElement('div')
          container.className = 'moedal-container'


          this.moedalOverlay = document.createElement('div')
          this.moedalOverlay.className = this.options.classes.overlay

          this.moedal = document.createElement('div')
          this.moedal.className = this.options.classes.moedal
          this.moedal.style.height = this.options.minHeight + 'px'
          this.moedal.style.width = this.options.minWidth + 'px'


          if (typeof this.options.content === 'string') {
               container.innerHTML = this.options.content
          } else {
               container.innerHTML = this.options.content.outerHTML
          }

          if (this.options.closeButton) {
               this.closeBtn = document.createElement('span')
               this.closeBtn.innerHTML = 'x'
               this.closeBtn.className = 'moedal-close'
               container.appendChild(this.closeBtn)
          }
         

          this.moedal.appendChild(container)

          fragment.appendChild(this.moedalOverlay)
          fragment.appendChild(this.moedal)
              
          document.body.appendChild(fragment)

          this.show()
          // this.moedalOverlay.addEventListener('click', this.close.bind(this)) 
          
          // initEvents.call(this) 
       
          instance = this
     }

     // function initEvents() {
     //      this.closeBtn.addEventListener('click', this.close.bind(this))
     // }

     


     return Moedal;
}))