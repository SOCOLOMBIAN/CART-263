/**
 * shapes.js
 * Defines SVG shapes used in the game.
 * Each constant contains an SVG string for a different game shape.
 */

const raro=`
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 392.18 374.18">
    <defs>
      <style>
        .cls-1 {
          fill: none;
        }
  
        .cls-1, .cls-2 {
          stroke: #fff;
          stroke-miterlimit: 10;
          stroke-width: 5px;
        }
  
        .cls-2 {
          fill: #fff;
        }
      </style>
    </defs>
    <path class="cls-1" d="M290.99,277.51c-13.73-10.31-18.52-9.59-22-16-7.03-12.97.11-36.8,15-45,11.76-6.48,18.14,2.41,46,1.31,13.19-.53,31.82-1.52,46-14.31,5.44-4.91,16.56-17.26,13-25-6.05-13.14-48.11.78-55-13.27-4.82-9.83,11.57-25.23,8-28.73-3.99-3.92-23.05,16.8-55,23-11.11,2.15-27.07,5.25-36-4-8.3-8.6-8.47-25.72-1-36,9.86-13.57,26.02-5.59,48-19,19.65-11.99,32.9-32.08,29-38-3.55-5.4-18.41,5.49-30-1.27-18.96-11.06-9.55-57.91-15-58.73-5.39-.81-9.08,45.97-30,51.73-17.09,4.7-33.61-21.28-43-15.73-10.84,6.42,11.05,41.64-6,69-.64,1.03-12.4,19.28-33,21.73-26.69,3.17-46.14-22.81-47-24-18.95-26.11-4.45-57.52-18-63.73-8.45-3.87-14.28,8.03-34,10.73-26.73,3.66-46.28-14.08-50.11-9-3.86,5.12,19.51,18.45,20.11,41,.57,21.61-20.11,39.19-13.79,46.22,2.29,2.55,5.83,2.4,15.31,7.6,1.68.92,3.47,2.19,5.48,4.09,17.76,16.86,19.4,52.66,4.39,66.33-3.81,3.47-5.89,2.63-15.39,7.03-7.28,3.37-30.1,11.34-34,25-2.25,7.88,3.76,9.48,7,24.73,4.9,23.09-6.32,31.53,1,45,3.57,6.56,10.71,10.38,25,18,16.98,9.06,25.46,13.59,32,11.27,14.92-5.29,6.79-32.35,28-51.27,10.12-9.03,13.6-4.31,28-15.73,18.35-14.54,19.84-27.86,29.13-28.27,12.61-.56,23.27,23.42,25.87,29.27,15.51,34.89,2.12,58.39,18,71,7.94,6.3,11.52.63,31,8.73,20.76,8.63,21.12,16.92,32.94,18.27,19.45,2.22,37.95-18,46.01-32.2,3.65-6.44,13.27-23.39,7.04-38.8-3.37-8.32-10.28-13.45-23-23Z"/>
    <path class="cls-2" d="M96.99,91.24c-13.7-5.81-35.51,3.33-41,18-5.49,14.7,6.83,31.12,12,38,13.38,17.82,25.66,16.9,29,30,3.38,13.28-6.1,26.55-10,32-5.77,8.08-9.71,9.21-32.43,26-23.29,17.21-25.9,21-27.57,24-5.43,9.77-10.47,28.38,0,42,8.9,11.57,26.75,16.65,39,11,17.24-7.94,9.82-30.85,31.72-57,5.17-6.17,17.11-20.44,36.28-25,31.75-7.55,69.79,14.75,75,39,2.32,10.8-3.19,15.87,0,34,1.44,8.17,3.6,20.48,12,29,16.62,16.87,53.41,14.64,63,0,11.13-16.98-49.9-45.48-43-79,4.32-21,30.09-25.39,29-44-.89-15.32-18.6-16.6-29.22-36.28-17.72-32.83,7.58-73.7-.78-77.72-6.72-3.23-17.74,25.72-49.12,40-17.64,8.03-48.3,14.41-66.88,0-18.16-14.08-10.67-37.07-27-44Z"/>
  </svg>
`
const prisma=`
<svg id="cuadro" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375.32 420.49">
    <defs>
      <style>
        .cls-1 {
          fill: none;
        }
  
        .cls-1, .cls-2 {
          stroke: #fff;
          stroke-miterlimit: 10;
          stroke-width: 10px;
        }
  
        .cls-2 {
          fill: #fff;
        }
      </style>
    </defs>
    <polygon class="cls-1" points="177.28 237.27 369.85 264.64 356.95 99.61 140.28 8.12 177.28 237.27"/>
    <polygon class="cls-2" points="199.64 216.09 341.15 235.95 331.67 116.23 172.46 49.86 199.64 216.09"/>
  </svg>

`

const estrella= `
<svg id="estrella" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 374.92 330">
    <defs>
      <style>
        .cls-1 {
          fill: none;
          stroke: #fff;
          stroke-miterlimit: 10;
          stroke-width: 5px;
        }
      </style>
    </defs>
    <path class="cls-1" d="M251.26,328.49c-5.26-6.97-32.68-41.93-81.36-52.33-52.9-11.31-89.63,15.22-95.37,19.53,23.3-24.25,30.53-59.8,18.55-92.79C79.27,164.86,42.16,136.34.27,132c42.91,4.63,81.88-13.61,99.9-46.95,20.19-37.36,5.2-77.26,2.57-83.94,2.43,4.91,25.16,49.12,75.42,62.41,37.99,10.05,77.07-1.44,101.31-29.61-32.85,29.05-38.63,77.19-15.66,114.4,18.58,30.1,53.56,49.12,89.91,49.3-50.79-12.4-97.81,8.33-113.46,46.29-16.11,39.08,7.95,79.65,10.99,84.6Z"/>
  </svg>

`
const circle= `

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504.7 504.7">
    <defs>
      <style>
        .cls-1 {
          stroke-width: 9px;
        }
  
        .cls-1, .cls-2 {
          fill: none;
        }
  
        .cls-1, .cls-2, .cls-3 {
          stroke: #fff;
          stroke-miterlimit: 10;
        }
  
        .cls-2 {
          stroke-width: 12px;
        }
  
        .cls-3 {
          fill: #fff;
          stroke-width: 5px;
        }
      </style>
    </defs>
    <g id="grande">
      <circle class="cls-2" cx="252.35" cy="252.35" r="246.35"/>
    </g>
    <g id="centro">
      <circle class="cls-1" cx="252.35" cy="252.35" r="177.55"/>
    </g>
    <g id="pequeno">
      <circle class="cls-3" cx="252.35" cy="252.35" r="114.08"/>
    </g>
  </svg>
  `