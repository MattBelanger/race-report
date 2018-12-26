var raceReports = {
  init: function() {
    this.loadRaceDays();
  },
  allDates: [],
  scratches: [],
  also_rans: [],
  loadRaceDays: function(firstRun = false) {
    $.getJSON('race-days.json',
      function(data) {
        raceReports.renderRaceDay(data[0]);
        $.each(data, function(element) {
          raceReports.allDates.push(data[element].Date);
        })
      });
  }, 
  loadRace: function(raceDate, raceNum) {
    this.scratches = [];
    this.also_rans = [];
    $.getJSON(raceNum+'.json', 
      function(data) {
        raceReports.renderRace(data);
      }
    );
  },
  renderRaceDay: function(dayData) {
    var theDate = dayData.Date;
    var raceLinks = [];
    $('#RaceDate').text(theDate);
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
    $('#Scratches').text(this.scratches.join(', '));
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
  $('#RaceLinks').on('click', 'a', function(event) {
    $('.selected').removeClass('selected');
    raceReports.loadRace(this.dataset.raceDate, this.dataset.raceNum)
  });
})