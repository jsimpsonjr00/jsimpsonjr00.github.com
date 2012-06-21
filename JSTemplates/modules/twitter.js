( function ( $ ) {
	var opts = {
        type:       "GET",
        dataType:   "jsonp",
        url:        "http://api.twitter.com/1/lists/statuses.json",
        data:       {
            list_id:   "52796954" //Miami Heat list statuses
        },
        success: function ( data, xhr, status ) {
        	var $tmln = $("#twtr-template-example");
            
            var $tmpl = $("#twtr-tweet-tmpl"),
               i = 0,
               setData = [];
            
            for( i = 0; i < data.length; i++ ) { //setup the data
                setData.push( setTweetData( data[i] ));
            }
            $tmln.html( $tmpl.applyTemplate( setData ) );
        },
        error: function (xhr, status, error) {
            $tmln.html( "<h2>Unable to connect with Twitter.</h2>");
        },
        timeout: (10 * 1000)
    };
    
    function linkifyStatus( text ) {
        text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
        return '<a target="_blank" rel="nofollow" href="' + s + '">' + s + '</a>';
        });

        text = text.replace(/(^|)@(\w+)/gi, function (s) {
        return '<a target="_blank" rel="nofollow" href="http://twitter.com/intent/user?screen_name=' + s.replace(/@/, "") + '">' + s + '</a>';
        });

        text = text.replace(/(^|)#(\w+)/gi, function (s) {
        return '<a target="_blank" rel="nofollow" href="http://twitter.com/#!/search/' + s.replace(/#/,'%23') + '">' + s + '</a>';
        });
        return text;
    };
    function updateTimestamp($tweet) {
        var stamp = this.getSinceTime($tweet.data("timestamp"));
        $tweet.text(stamp.sinceTime);
        return stamp.young;
    };
    function parseDate(dateString){
        var month = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11},
            then = dateString.split(" "),   time,   temp;

        //then = new Date(year, month, day, hours, minutes, seconds);
        if(dateString.search(",") === -1){//REST result, This format: Tue Aug 02 12:16:08 +0000 2011
            time = then[3].split(":");
            temp = new Date(then[5], month[then[1]], then[2], time[0], time[1], time[2]);
        }               
        else{//Search result, This format: Sat, 13 Aug 2011 15:24:31 +0000
            then[0] = then[0].replace(",", "");
            time = then[4].split(":");
            temp = new Date(then[3], month[then[2]], then[1], time[0], time[1], time[2]);
        }
        return temp - Time.offset; //date in milliseconds since UTC
    };
    var Time = {
        offset: new Date().getTimezoneOffset() * 60 * 1000, //adjust for users timezone
        second:     1000,
        minute:     1000 * 60,
        hour:   1000 * 60 * 60,
        day:        1000 * 60 * 60 * 24,
        week:   1000 * 60 * 60 * 24 * 7
    };
    function getSinceTime(timestamp) {
        var rightNow = new Date(),
            strTimeAgo = "",
            diff = rightNow - timestamp,
            bYoung = true; //used to abort processing on very large timelines after 1+ day old messages

        if (isNaN(diff) || diff < 0) {
            strTimeAgo = ""; // return blank string if unknown
        }
        else if (diff < Time.second * 2) {
            strTimeAgo = "right now";
        }
        else if (diff < Time.minute) {
            strTimeAgo = Math.floor(diff / Time.second) + " seconds ago";
        }
        else if (diff < Time.minute * 2) {
            strTimeAgo = "1 minute ago";
        }
        else if (diff < Time.hour) {
            strTimeAgo = Math.floor(diff / Time.minute) + " minutes ago";
       }                
        else    if (diff < Time.hour * 2) {
            strTimeAgo = "1 hour ago";
       }
        else if (diff < Time.day) {
            strTimeAgo = Math.floor(diff / Time.hour) + " hours ago";
       }
       else {
            bYoung = false; 
             if (diff > Time.day && diff < Time.day * 2) {
            strTimeAgo = "yesterday";
        }
        else if (diff < Time.day * 365) {
            strTimeAgo = Math.floor(diff / Time.day) + " days ago";
        }
        else {
            strTimeAgo = "over a year ago";
        }
        }               
        return {sinceTime: strTimeAgo,young: bYoung};
    };
    
    function setTweetData( data ) {
        var timestamp = parseDate(data.created_at);
        
        if(data.from_user){ //Map Search results to a user object on data
            data.user = {screen_name: data.from_user, name: data.from_user, profile_image_url: data.profile_image_url};
        }
        
        var dataMap = {
            id_str: data.id_str,
            profile_image_url: data.user.profile_image_url,
            user_real_name: data.user.name,
            user_screen_name: data.user.screen_name,
            status_text: linkifyStatus(data.text),
            "timestamp": timestamp,
            since_time: getSinceTime(timestamp).sinceTime
        };
        
        return dataMap;
    };
    function twitterActive( e ) {
    	$.ajax( opts );
    };
    
    $(document).on("twitterActive", twitterActive );
})(jQuery);