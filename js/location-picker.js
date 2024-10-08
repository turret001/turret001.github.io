$.fn.locationPicker = function (e) {
  var n,
    t,
    a = this,
    o = $.extend(
      {
        address_el: 'input[data-type="address"]',
        map_el: '[data-type="map"]',
        save_el: '[data-type="location-store"]',
        raw_data: !1,
        init: { current_location: !0 },
      },
      e
    ),
    r = {},
    i = $(o.address_el),
    l = $(o.map_el),
    s = $(o.save_el),
    d = null,
    c =
      ((n = new OpenLayers.Size(32, 32)),
      (t = new OpenLayers.Pixel(-n.w / 2, -n.h)),
      new OpenLayers.Icon(
        "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-128.png",
        n,
        t
      )),
    g = function () {
      s.length > 0 && s.val(JSON.stringify(r));
    },
    p = function (e) {
      var n = {
        address: e.formatted_address,
        location: {
          lat: e.geometry.location.lat(),
          long: e.geometry.location.lng(),
        },
      };
      return o.raw_data && (r.raw = e), n;
    },
    u = function (e, n, t) {
      void 0 === t && (t = !0), m({ location: new google.maps.LatLng(e, n) });
      var a = new OpenLayers.LonLat(n, e).transform(
        new OpenLayers.Projection("EPSG:4326"),
        L.getProjectionObject()
      );
      (d = d ? L.getZoom() : 12),
        t && L.setCenter(a, d),
        (O = new OpenLayers.Marker(a, c)),
        y.clearMarkers(),
        y.addMarker(O);
    };
  (OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
      single: !0,
      double: !1,
      pixelTolerance: 0,
      stopSingle: !1,
      stopDouble: !1,
    },
    initialize: function (e) {
      (this.handlerOptions = OpenLayers.Util.extend(
        {},
        this.defaultHandlerOptions
      )),
        OpenLayers.Control.prototype.initialize.apply(this, arguments),
        (this.handler = new OpenLayers.Handler.Click(
          this,
          { click: this.trigger },
          this.handlerOptions
        ));
    },
    trigger: function (e) {
      var n = L.getLonLatFromPixel(e.xy).transform(
        L.getProjectionObject(),
        new OpenLayers.Projection("EPSG:4326")
      );
      (r = { location: { lat: n.lat, long: n.lon } }),
        geoCoder.geocode(
          { location: new google.maps.LatLng(n.lat, n.lon) },
          function (e, n) {
            "OK" == n && (r = p(e[0])),
              u(r.location.lat, r.location.long, !1),
              w();
          }
        );
    },
  })),
    l.attr("id") ||
      l.attr(
        "id",
        String.fromCharCode(65 + Math.floor(26 * Math.random())) + Date.now()
      );
  var L = new OpenLayers.Map(l.attr("id"));
  L.addLayer(new OpenLayers.Layer.OSM());
  var y = new OpenLayers.Layer.Markers("Markers");
  L.addLayer(y);
  var f = new OpenLayers.Control.Click();
  L.addControl(f), f.activate();
  var O = null;
  geoCoder = new google.maps.Geocoder();
  var h = new google.maps.places.Autocomplete(i[0], { types: ["geocode"] });
  google.maps.event.addListener(h, "place_changed", function () {
    (place = h.getPlace()),
      (r = p(place)),
      u(r.location.lat, r.location.long),
      w();
  }),
    (this.getData = function () {
      return r;
    }),
    (this.getAddress = function () {
      return r.formatted_address;
    });
  var m = function (e) {
    geoCoder.geocode(e, function (e, n) {
      "OK" == n &&
        (e.length > 0
          ? ((r = p(e[0])), u(r.location.lat, r.location.long), w())
          : ((r = {}), y.clearMarkers(), g(), w()));
    });
  };
  (this.setAddress = function (e) {
    m({ address: e });
  }),
    (this.setLocation = function (e, n) {
      m({ location: new google.maps.LatLng(e, n) });
    });
  var w = function () {
    r.address && i.val(r.address),
      g(),
      o.locationChanged && o.locationChanged(r);
  };
  return (
    o.init &&
      (o.init.current_location
        ? navigator.geolocation &&
          navigator.geolocation.getCurrentPosition(
            function (e) {
              u(e.coords.latitude, e.coords.longitude);
            },
            function (e) {
              u(49.8419505, 24.0315968);
            }
          )
        : o.init.address
        ? a.setAddress(o.init.address)
        : o.init.location && a.setLocation(o.init.location)),
    this
  );
};
