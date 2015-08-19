Template.color.events({
  'change input[type=color]': function (e) {
    var color = $(e.target).val();
    $('.hidden-text').val(color).trigger('input');
  },
  'input .hidden-text': function (e) {
    var color = $(e.target).val();
    var specialColor = tinycolor(color);
    var comp = specialColor.complement().toHexString();
    // get hex strings and slice to remove first value as is original color
    var analogous = specialColor.analogous().map(function (t) {return t.toHexString()}).slice(1);
    var monochromatic = specialColor.monochromatic().map(function (t) {return t.toHexString()}).slice(1);
    var splitComp = specialColor.splitcomplement().map(function (t) {return t.toHexString()}).slice(1);
    var triad = specialColor.triad().map(function (t) {return t.toHexString()}).slice(1);
    var tetrad = specialColor.tetrad().map(function (t) {return t.toHexString()}).slice(1);

    // set background color
    $('body').css('background-color', color);

    specialColor.isDark() ? $('.output-colors').css('color', '#fff') : $('.output-colors').css('color', '#000');


    // Show output
    Session.set('showOutput', true);


    // lightOrDark
    if (specialColor.isLight()) {
      Session.set('lightOrDark', 'light');
    } else if (specialColor.isDark()) {
      Session.set('lightOrDark', 'dark');
    }


    Session.set('analogous', analogous);
    Session.set('monochromatic', monochromatic);
    Session.set('complementary', comp);
    Session.set('splitComp', splitComp);
    Session.set('triad', triad);
    Session.set('tetrad', tetrad);

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
    var image = new Image;
    image.src = imgSrc;
    var colorThief = new ColorThief.colorRob();
    var dominantColor = hexify(colorThief.getColor(image));
    var palette = colorThief.getPalette(image);
    var paletteRgb = palette.map(function (cur, index) {
      return hexify(cur);
    });

    // palette
    Session.set('palette', paletteRgb);

    // show output section
    Session.set('showOutput', true);

    function hexify (colorArr) {
      return tinycolor('rgb(' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + ')').toHexString();
    }

    $('.hidden-text').val(dominantColor).trigger('input');
  }
});

// TODO: refactor colors into single property with loop to get session vars
Template.color.helpers({
  image: function () {
    return Images.findOne(Session.get('uploadedImg'));
  },
  analogous: function () {
    return Session.get('analogous');
  },
  monochromatic: function () {
    return Session.get('monochromatic');
  },
  splitComp: function () {
    return Session.get('splitComp');
  },
  triad: function () {
    return Session.get('triad');
  },
  tetrad: function () {
    return Session.get('tetrad');
  },
  complementary: function () {
    return Session.get('complementary');
  },
  lightOrDark: function () {
    return Session.get('lightOrDark');
  },
  showOutput: function () {
    return Session.get('showOutput');
  },
  palette: function () {
    return Session.get('palette');
  }
});

