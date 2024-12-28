LinkedinAutomation = {
    config: {
      scrollDelay: 500,
      actionDelay: 1000,
      nextPageDelay: 1000,
      maxRequests: -1,
      totalRequestsSent: 0,
      isRunning: false,
      sendNote: false,
      note: ""
    },

    sendMessage: function(type, data) {
      window.postMessage({ type, ...data }, '*');
    },

    log: function(message) {
      console.log(message);
      this.sendMessage('log', { text: message });
    },

    init: function (data, config) {
      if (!this.config.isRunning) return;
      
      this.log("🚀 Initializing automation...");
      setTimeout(() => {
        if (this.config.isRunning) {
          this.scrollBottom(data, config);
        }
      }, this.config.actionDelay);
    },

    start: function(userConfig = {}) {
      if (this.config.isRunning) {
        this.log("⚠️ Automation already in progress");
        return;
      }
      
      // Reset totalRequestsSent when starting fresh
      this.config = {
        ...this.config,
        scrollDelay: userConfig.scrollDelay || 500,
        actionDelay: userConfig.actionDelay || 500,
        nextPageDelay: userConfig.nextPageDelay || 1000,
        maxRequests: userConfig.maxRequests || -1,
        totalRequestsSent: 0,
        isRunning: true,
        sendNote: userConfig.sendNote || false,
        note: userConfig.note || ""
      };
      
      this.log("✨ Starting LinkedIn automation");
      this.init({}, this.config);
    },

    stop: function() {
      if (!this.config.isRunning) return;
      
      this.config.isRunning = false;
      this.log("🛑 Stopping automation");
      this.log(`📊 Total invites sent: ${this.config.totalRequestsSent}`);
      this.sendMessage('status', { text: 'Stopped' });
    },

    scrollBottom: function (data, config) {
      if (!this.config.isRunning) return;
      
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      this.log("📜 Scanning page...");
      setTimeout(() => {
        if (this.config.isRunning) {
          this.scrollTop(data, config);
        }
      }, this.config.scrollDelay);
    },

    scrollTop: function (data, config) {
      if (!this.config.isRunning) return;
      
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.log("🔄 Preparing to analyze connections");
      setTimeout(() => {
        if (this.config.isRunning) {
          this.inspect(data, config);
        }
      }, this.config.scrollDelay);
    },

    inspect: function (data, config) {
      if (!this.config.isRunning) return;
      var totalRows = this.totalRows();
      this.log("🔍 Found " + totalRows + " potential connections");
      
      if (totalRows >= 0) {
        this.compile(data, config);
      } else {
        this.log("✅ Page analysis complete");
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
        this.log("➡️ Moving to next page");
        setTimeout(() => {
          this.nextPage(config);
        }, config.nextPageDelay);
      } else {
        data.pageButtonTotal = data.pageButtons.length;
        this.log("💫 Found " + data.pageButtonTotal + " connect buttons");
        data.pageButtonIndex = 0;
        setTimeout(() => {
          this.sendInvites(data, config);
        }, config.actionDelay);
      }
    },

    sendInvites: function (data, config) {
      if (!this.config.isRunning) return;
      if (config.maxRequests == 0) {
        this.log("🎯 Maximum connections reached");
        this.complete(config);
        return;
      }

      // Get name for personalized note
      if (config.sendNote) {
        const nameElement = data.pageButtons[data.pageButtonIndex].closest('.entity-result__item')
          ?.querySelector('.entity-result__title-text a');
        data.connectNames = data.connectNames || [];
        data.connectNames[data.pageButtonIndex] = nameElement ? 
          nameElement.textContent.trim().split(' ')[0] : 'there';
      }

      this.log("💌 Sending invitation " + (data.pageButtonIndex + 1) + " of " + data.pageButtonTotal);
      var button = data.pageButtons[data.pageButtonIndex];
      button.click();

      if (config.sendNote) {
        setTimeout(() => this.clickAddNote(data, config), this.config.actionDelay);
      } else {
        setTimeout(() => this.clickDone(data, config), this.config.actionDelay);
      }
    },

    clickAddNote: function (data, config) {
      if (!this.config.isRunning) return;
      
      var buttons = document.querySelectorAll("button");
      var addNoteButton = Array.prototype.filter.call(buttons, function (el) {
        return el.textContent.trim() === "Add a note";
      });

      if (addNoteButton && addNoteButton[0]) {
        this.log("✏️ Adding personalized note");
        addNoteButton[0].click();
        setTimeout(() => this.pasteNote(data, config), this.config.actionDelay);
      } else {
        this.log("⚠️ Note button not found, sending without note");
        setTimeout(() => this.clickDone(data, config), this.config.actionDelay);
      }
    },

    pasteNote: function (data, config) {
        console.log(data, "here is th data")
      if (!this.config.isRunning) return;
      
      const noteTextBox = document.getElementById("custom-message");
      if (noteTextBox) {
        const note = config.note.replace(
          "{{name}}",
          data.connectNames[data.pageButtonIndex]
        );
        noteTextBox.value = note;
        noteTextBox.dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
        this.log("📝 Added note: " + note);
      }
      setTimeout(() => this.clickDone(data, config), this.config.actionDelay);
    },

    clickDone: function (data, config) {
      if (!this.config.isRunning) return;
      
      var buttons = document.querySelectorAll("button");
      var doneButton;
      
      if (config.sendNote) {
        doneButton = Array.prototype.filter.call(buttons, function (el) {
          return el.textContent.trim() === "Send";
        });
      } else {
        doneButton = Array.prototype.filter.call(buttons, function (el) {
          return el.textContent.trim() === "Send without a note" || el.textContent.trim() === "Send";
        });
      }

      if (doneButton && doneButton[0]) {
        this.log(config.sendNote ? "📨 Sending with note" : "📨 Sending without note");
        doneButton[0].click();
      }
      setTimeout(() => this.clickClose(data, config), this.config.actionDelay);
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
      this.log("📊 Total invites sent: " + config.totalRequestsSent);

      if (data.pageButtonIndex === data.pageButtonTotal - 1) {
        this.log("✅ Page completed successfully");
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
        this.log("🏁 All pages processed");
        return this.complete(config);
      }
      this.log("📄 Moving to next page");
      pagerButton[0].click();
      
      // Add a check for running state before proceeding to next page
      setTimeout(() => {
        if (this.config.isRunning) {
          // Wait for page to load
          setTimeout(() => {
            if (this.config.isRunning) {
              this.init({}, this.config);
            }
          }, 1000); // Wait for page load
        }
      }, this.config.nextPageDelay);
    },

    complete: function (config) {
      this.config.isRunning = false;
      this.log("🎉 Automation completed - Successfully sent " + config.totalRequestsSent + " invitations!");
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
        LinkedinAutomation.start(event.data.config);
    } else if (command === 'stop') {
        LinkedinAutomation.stop();
    }
});