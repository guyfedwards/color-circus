Template.color.events({
  'change input[type=color]': function (e) {
    var color = $(e.target).val();
    $('.hidden-text').val(color).trigger('input');
  },
  'input .hidden-text': function (e) {
    var color = $(e.target).val();
    var specialColor = tinycolor(color);
    var analogous = specialColor.analogous().map(function (t) {return t.toHexString()});
    var monochromatic = specialColor.monochromatic().map(function (t) {return t.toHexString()});
    var comp = specialColor.complement().toHexString();
    var splitComp = specialColor.splitcomplement().map(function (t) {return t.toHexString()});
    var triad = specialColor.triad().map(function (t) {return t.toHexString()});
    var tetrad = specialColor.tetrad().map(function (t) {return t.toHexString()});

    $('body').css('background-color', color);

    $('.js-orig-color').html(specialColor.getOriginalInput());
    $('.js-is-light').html(specialColor.isLight());
    $('.js-is-dark').html(specialColor.isDark());
    $('.js-complementary').html(specialColor.complement().toHexString());
    $('.js-complementary-tile').css('background-color', comp);

    specialColor.isDark() ? $('.output-colors').css('color', '#fff') : $('.output-colors').css('color', '#000');


    $('.js-analogous, .js-mono, .js-splitcomp, .js-triad, .js-tetrad').empty();


    for (var i = 0; i < analogous.length; i += 1) {
      $('.js-analogous').append('<div class="tile" style="background-color: ' + analogous[i] + '">' + '<span>' + analogous[i] + '</span></div>');
    }

    for (var i = 0; i < monochromatic.length; i += 1) {
      $('.js-mono').append('<div class="tile" style="background-color: ' + monochromatic[i] + '">' + '<span>' + monochromatic[i] + '</span></div>');
    }

    for (var i = 0; i < splitComp.length; i += 1) {
      $('.js-splitcomp').append('<div class="tile" style="background-color: ' + splitComp[i] + '">' + '<span>' + splitComp[i] + '</span></div>');
    }

    for (var i = 0; i < triad.length; i += 1) {
      $('.js-triad').append('<div class="tile" style="background-color: ' + triad[i] + '">' + '<span>' + triad[i] + '</span></div>');
    }

    for (var i = 0; i < tetrad.length; i += 1) {
      $('.js-tetrad').append('<div class="tile" style="background-color: ' + tetrad[i] + '">' + '<span>' + tetrad[i] + '</span></div>');
    }
  },
  'change input[type=file]': function (event, template) {
    var files = event.target.files;

    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        Session.set('uploadedImg', fileObj._id);
      });
    }

  },
  'load .js-img': function (event, template) {
        var imgSrc = Images.findOne(Session.get('uploadedImg')).url();
        //var imgSrc = fileObj.url();
        var image = new Image;
        image.src = imgSrc;
        var colorThief = new ColorThief.colorRob();
        var dominantColor = rgbify(colorThief.getColor(image));
        var dominantColorHex = tinycolor(dominantColor).toHexString();

        function rgbify (colorArr) {
          return 'rgb(' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + ')';
        }

        $('.hidden-text').val(dominantColorHex).trigger('input');
  }
});


Template.color.helpers({
  image: function () {
    return Images.findOne(Session.get('uploadedImg'));
  }
});

