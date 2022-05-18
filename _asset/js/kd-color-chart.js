// JavaScript Document

$( function() {

const $table = $('table'),
      $thead = $('thead'),
      $tbody = $('tbody');

// [ 100 / interval ]%
let interval = 50;

// Set color chart.
const setColorChart = function( $elem ) {

    let beforeColor = $elem.find('.before input').val(),
        afterColor = $elem.find('.after input').val();

    // "#" removal.
    beforeColor = beforeColor.replace('#','');
    afterColor = afterColor.replace('#','');
    
    // Check color.
    const regex = /^[0-9A-Za-z]{6}$/;
    if ( regex.test( beforeColor ) && regex.test( afterColor ) ) {

      // Before color.
      let bR10 = parseInt( beforeColor.substr( 0, 2 ), 16 ),
          bG10 = parseInt( beforeColor.substr( 2, 2 ), 16 ),
          bB10 = parseInt( beforeColor.substr( 4, 2 ), 16 );

      // After color.
      let aR10 = parseInt( afterColor.substr( 0, 2 ), 16 ),
          aG10 = parseInt( afterColor.substr( 2, 2 ), 16 ),
          aB10 = parseInt( afterColor.substr( 4, 2 ), 16 );

      // 色の差（絶対値）
      let dR = Math.abs( bR10 - aR10 ),
          dG = Math.abs( bG10 - aG10 ),
          dB = Math.abs( bB10 - aB10 );

      // Color interval.
      let iR = dR / interval,
          iG = dG / interval,
          iB = dB / interval;

      // 
      if( bR10 > aR10 ) iR = -iR;
      if( bG10 > aG10 ) iG = -iG;
      if( bB10 > aB10 ) iB = -iB;

      // 16
      const hexNum = function( num ){
        return ( '0' + num.toString( 16 ) ).slice( -2 ).toLocaleUpperCase()
      };

      // Color chart HTML.
      let colorChartHTML = '';

      for ( let i = 0; i <= interval; i++ ) {

        const r10 = bR10 + Math.round( iR * i ),
              g10 = bG10 + Math.round( iG * i ),
              b10 = bB10 + Math.round( iB * i ),
              rgb = r10 + ',' + g10 + ',' + b10;

        const r16 = hexNum( r10 ),
              g16 = hexNum( g10 ),
              b16 = hexNum( b10 ),
              hex = r16 + g16 + b16;

        colorChartHTML += ''
          + '<td style="background-color: #' + hex + ';">'
            + '<div class="ci" style="background-color: #' + hex + ';">'
              + '<div class="rgb">' + rgb + '</div>'
              + '<div class="hex">' + hex + '</div>'
            + '</div>'
          + '</td>';

      }

      $elem.find('td').remove();
      $elem.find('th.before').after( colorChartHTML );

    }
    
};

// initialize color chart.
const initColorChart = function() {

    // thead
    $thead.find('th.percent').remove();
    let tHeadHTML = '';
    for ( let i = 0; i <= interval; i++ ) {
      let percent = 100 - ( 100 / interval * i );
      percent = ( '000' + percent ).slice( -3 ).replace(/(^0{1,2})/g,'<span>$1</span>');
      tHeadHTML += '<th class="percent"><div class="ci">' + percent + '</div></th>';
    }
    $thead.find('th.before').after( tHeadHTML );

    // tbody
    $tbody.find('tr').each( function(){
      setColorChart( $( this ) );
    });

};
initColorChart();

// Input Color.
$table.on({
    'focus' : function(){
      $( this ).select();
    },
    'input' : function() {
      setColorChart( $( this ).closest('tr') );
    }
}, 'input.color');


// Clip borad.
$table.on('click', 'td', function(){

    const $this = $( this );

    if( !$this.is('.copy') ){

      const value = $this.find('.' + $('input[name="colorType"]:checked').val() ).text();

      $this.addClass('copy');
      setTimeout( function(){
        $this.removeClass('copy');
      }, 1000 );

      $('body').append('<input id="copy">');
      $('#copy').val( value ).focus().select();    
      document.execCommand('copy');
      $('#copy').remove();
      $('.input span').text( value );

    }

});

// Hover position.
$table.on({
    'mouseenter' : function() {
      $thead.find('th').eq( $( this ).index() ).addClass('hover');
    },
    'mouseleave' : function() {
      $thead.find('.hover').removeClass('hover');
    }
}, 'td');

});