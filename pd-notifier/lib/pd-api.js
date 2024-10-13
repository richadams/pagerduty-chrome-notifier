// Helper wrappers for PagerDuty API methods.
function PDAPI(apiKey, version = 2)
{
    // Members
    var self       = this;   // Self-reference
    self.apiKey    = apiKey; // API key used for requests.
    self.userAgent = "pd-chrome-notifier-" + chrome.runtime.getManifest().version; // Will be in the X-Requested-With header of requests.

    // Prepare the headers for each request type.
    this.prepareHeaders = function prepareHeaders()
    {
        var headers = new Headers();
        headers.append("X-Requested-With", self.userAgent);
        headers.append("X-PagerDuty-Api-Local", 1);
        headers.append("Accept", "application/vnd.pagerduty+json;version=" + version);

        // If we have a valid API key, authenticate using that.
        if (self.apiKey != null && self.apiKey.length == 20)
        {
            headers.append("Authorization", "Token token=" + self.apiKey);
        }

        return headers;
    }

    // Perform a GET request, and trigger the callback with the result.
    this.GET = function GET(url, callback, error_callback = null)
    {
        var options = {
            method: "GET",
            headers: self.prepareHeaders()
        }

        fetch(url, options).then((res) =>
        {
            // Success
            if (res.ok)
            {
                res.json().then((data) =>
                {
                    try
                    {
                        callback(data);
                    }
                    catch (e)
                    {
                        if (error_callback != null) { error_callback(res.status, res.text()); }
                    }
                });
            }
            // Non-200 response code.
            else
            {
                if (error_callback != null) { error_callback(res.status, res.statusText); }
            }
        });
    }

    // Fire and forget a PUT request.
    this.PUT = function PUT(url, data)
    {
        // We need to add a content-type when making outbound requests.
        var headers = self.prepareHeaders();
        headers.append("Content-Type", "application/json");

        fetch(url, {
            method: "PUT",
            headers: headers,
            body: data
        });
    }
}
