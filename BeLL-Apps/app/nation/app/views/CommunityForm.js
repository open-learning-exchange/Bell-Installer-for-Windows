$(function() {

  App.Views.CommunityForm = Backbone.View.extend({
    
    className: "addNation-form",
    vars:{},

    events: {
      "click #formButton": function()
      {
      	document.getElementById("addCommunity").submit();
      }, 
      "submit form" : "setForm" , 
    },
    template: $('#template-addCommunity').html(),

    
  render: function() {
  
      	var Nation = this.model
      	 this.$el.append(_.template(this.template, this.vars))
      	if(this.model.id!=undefined){
	  				buttonText="Update"
	  			
	  			$('#nation-name').val(Nation.get('Name'))
                $('#community-code').val(Nation.get('Code'))
                $('#nation-url').val(Nation.get('Url'))
	  			$('#org-name').val(Nation.get('SponserName'))
	  			$('#org-sponseraddress').val(Nation.get('SponserAddress'))
	  			$('#org-firstname').val(Nation.get('ContactFirstname'))
	  			
	  			$('#org-middlename').val(Nation.get('ContactMiddlename'))
          		$('#org-lastname').val(Nation.get('ContactLastname'))
          		
          		$('#org-phone').val(Nation.get('ContactPhone'))
          		$('#org-email').val(Nation.get('ContactEmail'))
          		$('#leader-firstname').val(Nation.get('LeaderFirstname'))
          		$('#leader-middlename').val(Nation.get('LeaderMiddlename'))
          		$('#leader-lastname').val(Nation.get('LeaderLastname'))
          		$('#leader-phone').val(Nation.get('LeaderPhone'))
          		$('#org-email').val(Nation.get('LeaderEmail'))
          		$('#leader-ID').val(Nation.get('LeaderId'))
          		$('#leader-password').val(Nation.get('LeaderPassword'))
          		$('#urg-name').val(Nation.get('UrgentName'))
          		$('#urg-phone').val(Nation.get('UrgentPhone'))
          		$('#auth-name').val(Nation.get('AuthName'))
          		$('#auth-date').val(Nation.get('AuthDate'))
       	}
       	var that = this
      
   
    },
    setForm:function(){
          this.model.set({
         		 Name:$('#nation-name').val(),
                 Code:$('#community-code').val(),
          		 Url:$('#nation-url').val(),
          		 SponserName:$('#org-name').val(),
          		 SponserAddress:$('#org-sponseraddress').val(),
          		 ContactFirstname:$('#org-firstname').val(),
          		 ContactMiddlename:$('#org-middlename').val(),
          		 ContactLastname:$('#org-lastname').val(),
          		 ContactPhone:$('#org-phone').val(),
          		 ContactEmail:$('#org-email').val(),
          		 LeaderFirstname:$('#leader-firstname').val(),
          		 LeaderMiddlename:$('#leader-middlename').val(),
          		 LeaderLastname:$('#leader-lastname').val(),
          		 LeaderPhone:$('#leader-phone').val(),
          		 LeaderEmail:$('#org-email').val(),
          		 LeaderId:$('#leader-ID').val(),
          		 LeaderPassword:$('#leader-password').val(),
          		 UrgentName:$('#urg-name').val(),
          		 UrgentPhone:$('#urg-phone').val(),
          		 AuthName:$('#auth-name').val(),
          		 AuthDate:$('#auth-date').val()
          });

        var context = this;
        $.ajax({
            url: '/community/_design/bell/_view/isDuplicateName?include_docs=true&key="'+context.model.get('Name')+'"',
            type: 'GET',
            dataType: "json",
            async: false,
            success: function (result) {
                // assumption: if control falls to the success function result.rows will never be undefined. it will value of an array
                if (result.rows.length > 1) { // if more than one community records with same 'Name' i-e duplicate community Name found in DB
                    alert("Community has duplicates in the database. Please delete other copies and retry.");
                    return;
                }
                else if (result.rows.length === 0) { // if no duplicates found in DB
                    context.model.save();
                    alert("Successfully Saved");
                    App.startActivityIndicator();
                    Backbone.history.navigate('listCommunity',{trigger:true});
                    App.stopActivityIndicator();
                }
                else { // result.rows.length = 1. one duplicate has been found in db but we need to check sth more, this is not enough
                    // the key, community 'Name' passed into the view did find a matching community and returned it
                    // but we must ensure that the community in DB is not the same i-e both of these do not belong to same community record/document
                    var duplicateCommunityInDB = result.rows[0].doc;
                    if( (context.model.id) && (context.model.id === duplicateCommunityInDB._id) ) {
                        // its the same community with some edit(s). not a new one which is has same name as another existing community
//                            alert("Same community edit");
                        context.model.save();
                        alert("Successfully Saved");
                        App.startActivityIndicator();
                        Backbone.history.navigate('listCommunity',{trigger:true});
                        App.stopActivityIndicator();
                    } else {
                        alert("Community 'Name' you entered is a duplicate. Please try again with a different name.");
                    }
                }
            }, error: function() {
                alert("There was an error in getting a response from the server. Please try again.");
            }
        });

//            context.model.save()
//            alert("Successfully Saved")
//            App.startActivityIndicator()
//            Backbone.history.navigate('listCommunity',{trigger:true});
//            App.stopActivityIndicator()
                         /*    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'jsonp',
                        data: JSON.stringify({
                            "source": "community_code",
                            "target": "http://10.10.2.79:5984/community_code"
                        }),
                        success: function (response) {
                            console.log(response)
                        },
                        async: false
                    });
                   
            
          	var myDonut = this.model.toJSON()
          	var m = JSON.stringify(myDonut)
          	alert(m)
          	$.ajax({
    			url : 'http://10.10.2.69:5984/community',
    			type : 'POST',
    			dataType : "jsonp",
    			data : m , 
    			success : function(json) {
    				console.log(json)
    				alert('ddkkkkddd')
    			}
    		})
          // $.ajax({
//                         headers: {
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json; charset=utf-8'
//                         },
//                         type: 'POST',
//                         url: 'http://10.10.2.79:5984/community_code',
//                         dataType: 'jsonp',
//                         data: JSON.stringify(myDonut),
//                         success: function (response) {
//                             
//                         	console.log(data)
//                             console.log(response)
//                         },
//                         async: false
//                     });
 				//$.post('community_code',)  */ 	 
            	 
            	 
            	 
       		//}
       		// else{
//        		alert('not validate');
//        		
//        		}
       }

  })

})
