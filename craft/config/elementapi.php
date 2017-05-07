<?php
namespace Craft;

return [
    'endpoints' => [
        'youth-members.json' => [
            'elementType' => 'Entry',
            'criteria' => [
                'section' => 'youthMembers',
                'householdTelephone' => craft()->request->getParam('phone')
            ],
            'transformer' => function(EntryModel $entry) {
	            if(craft()->request->getParam('phone') != ''){
	                return [
	                    'first_name' => $entry->youthMemberFirstName,
	                    'last_name' => $entry->youthMemberLastName,
	                    'slug' => $entry->slug
	                ];
	            } else {
		           return null; 
	            }
            },
        ],
        'youth-members/<slug:{slug}>.json' => function($slug) {
		    return [
			    'elementType' => 'Entry',
		        'criteria' => [
		            'section' => 'youthMembers',
		            'slug' => $slug,
		            'youthMemberPin' => craft()->request->getParam('pin')
		        ],
		        'first' => true,
		        'transformer' => function(EntryModel $entry) {
			        $myWard = '';
			        $myYouthGroup = '';
			        $myEvents = array();
		            foreach ($entry->youthMemberWard as $ward) {
		                $myWard = $ward->title;
		            }
		            foreach ($entry->youthMemberYouthGroup as $youthGroup) {
		                $myYouthGroup = $youthGroup->title;
		            }
		            foreach ($entry->registeredForEvents as $event) {
		                $myEvents[] = $event->id;
		            }
		            return [
			            'id' => $entry->id,
			            'slug' => $entry->slug,
			            'title' => $entry->title,
		                'first_name' => $entry->youthMemberFirstName,
						'last_name' => $entry->youthMemberLastName,
		                'ward' => $myWard,
		                'youth_group' => $myYouthGroup,
		                'household_telephone' => $entry->householdTelephone,
		                'registered_events' => $myEvents
		            ];
		        },
		    ];
		},
		'relevant-events.json' => [
            'elementType' => 'Entry',
            'criteria' => [
                'section' => 'events',
                'status' => ['live','pending'],
                'relatedTo' => ['targetElement' => ['or', craft()->request->getParam('youth_group_id'), 22]]
            ],
            'transformer' => function(EntryModel $entry) {
                return [
                    'event_title' => $entry->title,
                    'slug' => $entry->slug
                ];
            },
        ]
    ]
];
?>