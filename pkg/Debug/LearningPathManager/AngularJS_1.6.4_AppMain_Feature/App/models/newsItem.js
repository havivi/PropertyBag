// create namespace for this project
var ajs = ajs || {};
ajs.models = ajs.models || {};

// News item entity
ajs.models.newsItem = function () {
    this.Id = undefined;
    this.Title = undefined;
    this.Body = undefined;
    this.Expires = undefined;
    this.__metadata = {
        type: 'SP.Data.NewsListItem'
    };
};