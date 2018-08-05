<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var string
     */
    protected $fillable = [
		'name', 'description', 'links', 'billing'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * Make relation between the user and the projects
     *
     * @return mixed
     */
    public function users() {
    	return $this->belongsToMany(User::class);
    }

    /**
     * Make relation between the project and the tasks
     *
     * @return mixed
     */
    public function task() {
        return $this->hasMany(Task::class);
    }

    /**
     * Make relation between the project and the resources
     *
     * @return mixed
     */
    public function resources() {
        return $this->hasMany(Resource::class);
    }

    /**
     * Evaluates projects state
     *
     * @return boolean
     */
    public function isLate() {
    	// todo vérifier si project en retard
    }
}
