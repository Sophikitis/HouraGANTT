<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var string
     */
    protected $fillable = [
		'name'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'roles';

    /**
     * Make relation between the user and the role
     *
     * @return mixed
     */
    public function user() {
    	return $this->hasMany(User::class);
    }
}
