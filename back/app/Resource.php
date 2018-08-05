<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var string
     */
    protected $fillable = [
		'name', 'ratio', 'job', 'first_name', 'project_id'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'resources';

    /**
     * Make relation between the project and the tasks
     *
     * @return mixed
     */
    public function project() {
        return $this->belongsTo(Project::class,'project_id','id');
    }

    /**
     * Make relation between the tasks and the resources
     *
     * @return mixed
     */
    public function task() {
        return $this->hasMany(Task::class);
    }
}
