var raceReports = {
  race_days_url: 'https://5hioggs5t4.execute-api.us-east-2.amazonaws.com/default/race-days',
  race_url: 'https://5hioggs5t4.execute-api.us-east-2.amazonaws.com/default/races', //?race_date=2018-11-25&race_number=1'
  init: function() {
    $('#RaceLinks').on('click', 'a', function(event) {
      $('.selected').removeClass('selected');
      raceReports.loadRace(this.dataset.raceDate, this.dataset.raceNum)
    });

    $('#RaceDate').change(function() {
      raceReports.renderRaceDay();
    });
    this.loadRaceDays();
  },
  allDates: [],
  scratches: [],
  also_rans: [],
  raceData: {},
  loadRaceDays: function(firstRun = false) {
    $.getJSON(this.race_days_url,
      function(data) {
        $.each(data, function(element) {
          var date = data[element].Date;
          raceReports.allDates.push(date);
          raceReports.raceData[date] = data[element];
        })
        raceReports.renderDateSelect();
      });
  }, 
  loadRace: function(raceDate, raceNum) {
    this.scratches = [];
    this.also_rans = [];
    $.getJSON(this.race_url+'?race_date='+raceDate+'&race_number='+raceNum, 
      function(data) {
        raceReports.renderRace(data);
      }
    );
  },
  renderDateSelect: function() {
    var select = $('#RaceDate');
    var first = true;
    $.each(this.allDates, function(el, value) {
      select.append(new Option(value, value));
      if (first) {
        select.val(value);
        first = false;
      }
    });
    this.renderRaceDay();
  },
  renderRaceDay: function() {
    var theDate = $('#RaceDate').val();
    var dayData = this.raceData[theDate];
    var raceLinks = [];
    for (i=1;i<=dayData.NumRaces;i++) {
      raceLinks.push(this.makeRaceLink(theDate, i));
    }
    $('#RaceLinks').html(raceLinks.join(' '));
    this.loadRace(theDate, 1);
  },
  renderRace: function(raceData) {
    $('#RaceLink'+raceData.Number).addClass('selected');
    $('#RaceSurface').text(raceData.Surface);
    $('#RaceConditions').text(raceData.TrackCondition);
    $('#RaceNumber').text(raceData.Number);
    $.each(raceData.Entries, function (entry) {
      raceReports.parseEntry(this);
    });
    $('#AlsoRans').text(this.also_rans.join(', '));
    if (this.scratches.length > 0) {
      $('#ScratchContainer').show();
      $('#Scratches').text(this.scratches.join(', '));
    } else {
      $('#ScratchContainer').hide();
    }
  },
  renderWin: function(entry) {
    $('#WinHorse').text(entry.Horse.Name);
    $('#WinWinAmount').text("$" + entry.WinPayoff.toFixed(2));
    $('#WinPlaceAmount').text("$" + entry.PlacePayoff.toFixed(2));
    $('#WinShowAmount').text("$" + entry.ShowPayoff.toFixed(2));
  },
  renderPlace: function(entry) {
    $('#PlaceHorse').text(entry.Horse.Name);
    $('#PlacePlaceAmount').text("$" + entry.PlacePayoff.toFixed(2));
    $('#PlaceShowAmount').text("$" + entry.ShowPayoff.toFixed(2));
  },
  renderShow: function(entry) {
    $('#ShowHorse').text(entry.Horse.Name);
    $('#ShowShowAmount').text("$" + entry.ShowPayoff.toFixed(2));
  },
  setScratch: function(entry) {
    this.scratches.push(entry.Horse.Name);
  },
  setAlsoRan: function(entry) {
    this.also_rans.push(entry.Horse.Name);
  },
  parseEntry: function(entry) {
    if (entry.Scratched) {
      this.setScratch(entry);
      return;
    }

    switch(entry.FinishPosition) {
      case 1:
        this.renderWin(entry);
        break;
      case 2:
        this.renderPlace(entry);
        break;
      case 3:
        this.renderShow(entry);
        break;
      default:
        this.setAlsoRan(entry);
    }
  },
  makeRaceLink: function (raceDate, raceNum) {
    return '<a id="RaceLink'+raceNum+'" href="#" class="race_link" data-race-date="'+raceDate+'" data-race-num="'+raceNum+'">'+raceNum+'</a>';
  }
};


$(function(){
  raceReports.init();
})