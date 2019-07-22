const data = [
    ['ok', 25],
    ['good', 25],
    ['excellent', 50],
    ['bad', 0]
]

// const margin = { top: 100, right: 70, bottom: 100, left: 65 };
const width = 120;
const height = 120;
const r_width= 200;
const r_height = 200;
const radius = Math.min(r_width, r_height) / 2;

const tooltip = d3.select('.tooltip')
    .style('display', 'inherit');
const amount = d3.select('.amount');
const item = d3.select('.item');
amount
    .text(260);
item
    .text(`Голосов`);

const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'group-container')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal([
    'url(#purple)',
    'url(#green)',
    'url(#orange)',

]);



const pie = d3.pie()
    .sort(null)
    .value((d) => d[1]);

const path = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 45);

const pathTwo = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 50);

const arc = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc')



var purple = arc.append("linearGradient")
    .attr("id", "purple")
    .attr("y1", "0%")
    .attr("y2", "100%");
purple.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "#bc9cff")
    .attr("stop-opacity", 1);
purple.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "#8BA4F9")
    .attr("stop-opacity", 1);

var green = arc.append("linearGradient")
    .attr("id", "green")
    .attr("x1", "100%")
    .attr("x2", "0%");
green.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "#6FCF97")
    .attr("stop-opacity", 1);
green.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "#66D2EA")
    .attr("stop-opacity", 1);

var orange = arc.append("linearGradient")
    .attr("id", "orange")
    .attr("y1", "00%")
    .attr("y2", "100%");
orange.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "#FFE39C")
    .attr("stop-opacity", 1);
orange.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "#FFBA9C")
    .attr("stop-opacity", 1);


arc.append('path')
    .attr('d', path)
    .attr('fill', (d, i) => color(i))
    .attr('stroke', (d, i) => "none")
    // .attr('stroke', (d, i) => color(i))
    .on('mouseover', function(d) {
        d3.select(this)
            .transition()
            .style('cursor', 'pointer')
            .attr('d', pathTwo);

        // const tooltip = d3.select('.tooltip')
        //   .style('display', 'inherit');

        // const amount = d3.select('.amount');
        // const item = d3.select('.item');

        // amount
        //.text(`${d.data[1]}`);

        // item
        // .text(`${d.data[0]}`);
    })
    .on('mouseout', function(d) {
        // const tooltip = d3.select('.tooltip')
        //   .style('display', 'none')

        d3.select(this)
            .transition()
            .attr('d', path);
    });