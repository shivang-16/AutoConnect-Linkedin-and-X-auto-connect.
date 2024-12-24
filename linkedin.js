Linkedin = {
    config: {
      scrollDelay: 500,
      actionDelay: 500,
      nextPageDelay: 1000,
      maxRequests: -1,
      totalRequestsSent: 0,
      isRunning: false
    },

    sendMessage: function(type, data) {
      window.postMessage({ type, ...data }, '*');
    },

    log: function(message) {
      console.log(message);
      this.sendMessage('log', { text: message });
    },

    init: function (data, config) {
      this.log("Script initialized on the page");
      this.log("Scrolling to bottom in " + config.scrollDelay + " ms");
      setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
    },

    start: function() {
      if (this.config.isRunning) {
        this.log("Script is already running");
        return;
      }
      this.log("Starting LinkedIn automation");
      this.config.isRunning = true;
      this.init({}, this.config);
    },

    stop: function() {
      this.log("Stopping LinkedIn automation");
      this.config.isRunning = false;
      this.sendMessage('status', { text: 'Stopped' });
    },

    scrollBottom: function (data, config) {
      if (!this.config.isRunning) return;
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      this.log("Scrolling to bottom of page");
      setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
    },

    scrollTop: function (data, config) {
      if (!this.config.isRunning) return;
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.log("Scrolling to top of page");
      setTimeout(() => this.inspect(data, config), config.scrollDelay);
    },

    inspect: function (data, config) {
      if (!this.config.isRunning) return;
      var totalRows = this.totalRows();
      this.log("Found " + totalRows + " search results");
      
      if (totalRows >= 0) {
        this.compile(data, config);
      } else {
        this.log("No more search results found");
        this.complete(config);
      }
    },

    compile: function (data, config) {
      if (!this.config.isRunning) return;
      var elements = document.querySelectorAll("button");
      data.pageButtons = [...elements].filter(function (element) {
        return element.textContent.trim() === "Connect";
      });

      if (!data.pageButtons || data.pageButtons.length === 0) {
        this.log("No connect buttons found on page");
        setTimeout(() => {
          this.nextPage(config);
        }, config.nextPageDelay);
      } else {
        data.pageButtonTotal = data.pageButtons.length;
        this.log(data.pageButtonTotal + " connect buttons found");
        data.pageButtonIndex = 0;
        setTimeout(() => {
          this.sendInvites(data, config);
        }, config.actionDelay);
      }
    },

    sendInvites: function (data, config) {
      if (!this.config.isRunning) return;
      if (config.maxRequests == 0) {
        this.log("Max requests reached");
        this.complete(config);
        return;
      }

      this.log("Sending invite " + (data.pageButtonIndex + 1) + " of " + data.pageButtonTotal);
      var button = data.pageButtons[data.pageButtonIndex];
      button.click();
      setTimeout(() => this.clickDone(data, config), config.actionDelay);
    },

    clickDone: function (data, config) {
      if (!this.config.isRunning) return;
      var buttons = document.querySelectorAll("button");
      var doneButton = Array.prototype.filter.call(buttons, function (el) {
        return el.textContent.trim() === "Send without a note";
      });

      if (doneButton && doneButton[0]) {
        this.log("Clicking send button");
        doneButton[0].click();
      }
      setTimeout(() => this.clickClose(data, config), config.actionDelay);
    },

    clickClose: function (data, config) {
      if (!this.config.isRunning) return;
      var closeButton = document.getElementsByClassName(
        "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
      );
      if (closeButton && closeButton[0]) {
        closeButton[0].click();
      }

      config.maxRequests--;
      config.totalRequestsSent++;
      this.sendMessage('stats', { totalInvites: config.totalRequestsSent });
      this.log("Total invites sent: " + config.totalRequestsSent);

      if (data.pageButtonIndex === data.pageButtonTotal - 1) {
        this.log("All connections for this page done");
        setTimeout(() => this.nextPage(config), config.actionDelay);
      } else {
        data.pageButtonIndex++;
        setTimeout(() => this.sendInvites(data, config), config.actionDelay);
      }
    },

    nextPage: function (config) {
      if (!this.config.isRunning) return;
      
      var pagerButton = document.getElementsByClassName(
        "artdeco-pagination__button--next"
      );
      if (
        !pagerButton ||
        pagerButton.length === 0 ||
        pagerButton[0].hasAttribute("disabled")
      ) {
        this.log("No next page available");
        return this.complete(config);
      }
      this.log("Moving to next page");
      pagerButton[0].click();
      setTimeout(() => this.init({}, config), config.nextPageDelay);
    },

    complete: function (config) {
      this.config.isRunning = false;
      this.log("Automation completed - Total invites sent: " + config.totalRequestsSent);
      this.sendMessage('status', { text: 'Completed' });
    },

    totalRows: function () {
      var search_results = document.getElementsByClassName("search-result");
      if (search_results && search_results.length != 0) {
        return search_results.length;
      } else {
        return 0;
      }
    },
};

// Listen for window messages
window.addEventListener('message', function(event) {
    if (event.source !== window) return;

    const command = event.data.command;
    if (command === 'start') {
        Linkedin.start();
    } else if (command === 'stop') {
        Linkedin.stop();
    }
});