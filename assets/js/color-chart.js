// JavaScript Document

$( function() {

const $color = $('#colorChart'),
      $shade = $('#shade'),
      $type = $('input[name="colorType"]');

const regex = /^[0-9A-Za-z]{6}$/;

let value = '',
    percent = '',
    type = 'hex',
    shade = 10,
    colors = [
        ['common','000000','FFFFFF']
    ];

// Set color chart.
const colorChartLine = function( beforeColor, afterColor, name ) {

    // Check color.
    if ( regex.test( beforeColor ) && regex.test( afterColor ) ) {

      // Before color.
      let bR10 = parseInt( beforeColor.substr( 0, 2 ), 16 ),
          bG10 = parseInt( beforeColor.substr( 2, 2 ), 16 ),
          bB10 = parseInt( beforeColor.substr( 4, 2 ), 16 );

      // After color.
      let aR10 = parseInt( afterColor.substr( 0, 2 ), 16 ),
          aG10 = parseInt( afterColor.substr( 2, 2 ), 16 ),
          aB10 = parseInt( afterColor.substr( 4, 2 ), 16 );

      // Absolute value.
      let dR = Math.abs( bR10 - aR10 ),
          dG = Math.abs( bG10 - aG10 ),
          dB = Math.abs( bB10 - aB10 );

      // Color interval.
      let iR = dR / shade,
          iG = dG / shade,
          iB = dB / shade;

      // Greater.
      if( bR10 > aR10 ) iR = -iR;
      if( bG10 > aG10 ) iG = -iG;
      if( bB10 > aB10 ) iB = -iB;

      // 16
      const hexNum = function( num ){
        return ( '0' + num.toString( 16 ) ).slice( -2 ).toLocaleUpperCase()
      };

      // Color chart HTML.
      const colorChart = [],
            logColorList = [];

      for ( let i = 0; i <= shade; i++ ) {
        
        const par = 100 - Math.round( 100 / shade * i );
        
        const r10 = bR10 + Math.round( iR * i ),
              g10 = bG10 + Math.round( iG * i ),
              b10 = bB10 + Math.round( iB * i ),
              rgb = r10 + ',' + g10 + ',' + b10;

        const r16 = hexNum( r10 ),
              g16 = hexNum( g10 ),
              b16 = hexNum( b10 ),
              hex = r16 + g16 + b16;

        colorChart.push(``
        + `<td style="background-color: #${hex}" data-rgb="${rgb}" data-hex="${hex}" data-per="${par}">`
            + `<div class="ci" style="background-color: #${hex}"></div>`
        + `</td>`);
        logColorList.push(`--${name}${par}:#${hex};`);
      }
      window.console.log( logColorList.join('') );
      
      return colorChart.join('');
    }
};
const colorChartRow = function( name, beforeColor, afterColor ){
    return ``
    + `<th class="move"><div class="moveBtn"></div></th>`
    + `<th class="inputTh"><input class="name" type="text" value="${name}"></th>`
    + `<th class="inputTh beforeTh"><input class="before color" type="text" value="${beforeColor}"></th>`
    + colorChartLine( beforeColor, afterColor, name )
    + `<th class="inputTh"><input class="after color" type="text" value="${afterColor}"></th>`
    + `<th class="delete"><div class="deleteBtn"></div></th>`;
}
const updateRow = function( $row ){
    const beforeColor = $row.find('input.before').val(),
          afterColor = $row.find('input.after').val();
    if ( regex.test( beforeColor ) && regex.test( afterColor ) ) {
        const index = $row.index('tbody tr');
        colors[index][1] = beforeColor;
        colors[index][2] = afterColor;
        $row.find('td').remove();
        $row.find('th.beforeTh').after( colorChartLine( beforeColor, afterColor, $row.find('.name').val() ) );
    }
    
};

const init = function(){

    // thead
    const tHead = [];
    for ( let i = 0; i <= shade; i++ ) {
      const percent = ('000' + ( 100 - Math.round( 100 / shade * i ))).slice( -3 ).replace(/(^0{1,2})/g,'<span>$1</span>');
      tHead.push('<th class="percent"><div class="ci">' + percent + '</div></th>');
    }
    
    // tbody
    const tbody = [],
          colorLength = colors.length;
    for ( let i = 0; i < colorLength; i++ ) {
        tbody.push(``
        + `<tr>`
            + colorChartRow( colors[i][0], colors[i][1], colors[i][2] )
        + `</tr>`);
    }
    
    // html
    $color.html(``
    + `<table>`
        + `<thead>`
            + `<tr>`
                + `<th class="">MOVE</th>`
                + `<th class="">NAME</th>`
                + `<th class="">BEFORE</th>`
                + tHead.join('')
                + `<th class="">AFTER</th>`
                + `<th class="">DEL</th>`
            + `</tr>`
        + `</thead>`
        + `<tbody>`
            + tbody.join('')
        + `</tbody>`
    + `</table>`);
    
    // set
    $shade.val( shade );
    $type.val([type]);
};

$type.on('change', function(){
    type = $( this ).val();
});

$shade.on('change', function(){
    shade = $( this ).val();
    init();
});

// Input Color.
$color.on({
    'focus' : function(){
      $( this ).select();
    },
    'input' : function() {
        updateRow($(this).closest('tr'));
    }
}, 'input.color');

$color.on({
    'focus' : function(){
      $( this ).select();
    },
    'input' : function() {
        const index = $(this).closest('tr').index('tbody tr');
        colors[index][0] = $(this).val();
    }
}, 'input.name');

// Clip borad.
$color.on('click', 'td', function(){
    const $this = $( this );

    if( !$this.is('.copy') ){
      $this.addClass('copy');
      navigator.clipboard.writeText( value ).then( function(){
          setTimeout( function(){ 
              $this.removeClass('copy');
          }, 1000 );
      });
    }
});

// Hover position.
$color.on({
    'mouseenter' : function() {
      const $td = $( this );
      
      value = ( type === 'hex')? $td.data('hex'): $td.data('rgb');
      percent = $td.data('per');
      $('.target').text(`${value} / ${percent}%`);
      
      $color.find('thead th').eq( $( this ).index() ).addClass('hover');
    },
    'mouseleave' : function() {
      $color.find('thead').find('.hover').removeClass('hover');
      $('.target').text('none');
    }
}, 'td');

// Read file.
$('#file').on('click', function(){
    const $inputFile = $('<input>', { type: 'file'});    
    $inputFile.on('change', function(){
        const file = this.files[0],
              reader = new FileReader();
        reader.onload = function() {
            setColorData( reader.result );
            init();
        };
        reader.onerror = function() {
            alert('Read error.');
        };
        reader.readAsText(file);
    }).click();
});


const getColorData = function(){
    return {
        'option': {
            'type': type,
            'shade': shade
        },
        'colors': colors
    };
};
const setColorData = function( jsonData ) {
    try {
      jsonData = JSON.parse( jsonData );
      if ( jsonData.option ) {
          shade = jsonData.option.shade? jsonData.option.shade: 20;
          type = jsonData.option.type? jsonData.option.type: 'hex';
      }
      if ( jsonData.colors ) colors = jsonData.colors;
    } catch(e) {
        alert('JSON error');
        window.console.error(e);
    }
};

// Download
$('#download').on('click', function(){
    try {
        const blob = new Blob([ JSON.stringify( getColorData() ) ], {'type': 'text/plain'}),
              url = URL.createObjectURL( blob ),
              a = document.createElement('a');
        a.href = url;
        a.download = 'color-chart.json';
        a.click();
        URL.revokeObjectURL( url );
    } catch(e) {
        alert('Download error.');
        window.console.error(e);
    }
});

// Add
$('#add').on('click', function(){
    colors.push(['','000000','FFFFFF']);
    $color.find('tbody').append(`<tr>${colorChartRow('','000000','FFFFFF')}</tr>`);
});

// Input focus.
$color.on('click', '.inputTh', function(){
    $(this).find('input').select();
});

// Delete.
$color.on('click', '.deleteBtn', function(){
    const $tr = $(this).closest('tr'),
          index = $tr.index('tbody tr');
    colors.splice( index, 1 );
    $tr.remove();
});

// Move.
$color.on('mousedown', '.moveBtn', function( mde ){
    getSelection().removeAllRanges();

    const $move = $( this ),
          $window = $( window );

    const $line = $move.closest('tr'),
          $list = $line.closest('tbody'),
          index =  $line.index('tbody tr'),
          color = colors[index].concat(),
          height = $line.outerHeight(),
          defaultY = $line.position().top,
          $dummy = $('<tr class="dummy"></tr>');
 
    colors.splice( index, 1 );
    
    $list.addClass('active');
    $line.addClass('moveTr').css({
        'height': height,
        'top': defaultY
    }).after( $dummy )
    $dummy.css('height', height );

    $window.on({
      'mousemove.move': function( mme ){
        const maxY = $list.outerHeight() - height;
        let positionY = defaultY + mme.pageY - mde.pageY;
        if ( positionY < 0 ) positionY = 0;
        if ( positionY > maxY ) positionY = maxY;
        $line.css('top', positionY );
        if ( $( mme.target ).closest('tbody tr').length ) {
          const $target = $( mme.target ).closest('tr'),
                targetNo = $target.index(),
                dummyNo = $dummy.index();
          if ( targetNo < dummyNo ) {
            $target.before( $dummy );
          } else {
            $target.after( $dummy );
          }
        }
      },
      'mouseup.move': function(){
        $window.off('mousemove.move mouseup.move');
        $list.removeClass('active');
        $line.removeClass('moveTr').removeAttr('style');
        $dummy.replaceWith( $line );
        
        const afterIndex = $line.index('tbody tr');
        colors.splice( afterIndex, 0, color );
      }
    });
});

// Storage key.
const storageKey = 'colorChart';

// Set local storage.
$('#set').on('click', function(){
    if ( localStorage ) {
        try {
            localStorage.setItem( storageKey, JSON.stringify( getColorData() ) );
        } catch( e ) {
            window.console.error( e.message );
            localStorage.removeItem( storageKey );
        }
    }
});
// Clear local storage.
$('#clear').on('click', function(){
    if ( localStorage ) {
        localStorage.removeItem( storageKey );
    }
});

const storageItem = localStorage.getItem( storageKey );
if ( storageItem !== null ) {
    setColorData( storageItem );
}
init();

});