<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var string
     */
    protected $fillable = [
		'name', 'starts_at', 'ends_at', 'is_finished', 'additional_cost', 'project_id', 'speciality_id', 'resource_id','duration','progress','complete'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tasks';

    /**
     * Make relation between the project and the tasks
     *
     * @return mixed
     */
    public function project() {
    	return $this->belongsTo(Project::class);
    }

    /**
     * Make relation between the resource and the tasks
     *
     * @return mixed
     */
    public function myResource() {
        return $this->belongsTo(Resource::class,'resource_id','id');
    }
}
