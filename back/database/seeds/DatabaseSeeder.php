<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
        	'name' => 'Testeur',
            'user_id' => 1,
            'created_at' => date('Y-m-d H:m:s'),
        ]);

        DB::table('specialities')->insert([
            'name' => str_random(8),
            'created_at' => date('Y-m-d H:m:s'),
        ]);

        DB::table('users')->insert([
            'first_name' => str_random(8),
            'last_name' => str_random(8),
            'email'=> str_random(8).'@yopmail.com',
            'password' => 'Azerty123',
            'role_id' => 1,
            'rgpd_accepted' => true,
            'remember_token' => str_random(25),
            'created_at' => date('Y-m-d H:m:s'),
        ]);

        DB::table('projects')->insert([
        	'name' => str_random(8),
        	'duration_days' => 12,
        	'description'=> str_random(8),
        	'link' => str_random(8),
        	'billing' => str_random(8),
            'created_at' => date('Y-m-d H:m:s'),
        ]);

        DB::table('resources')->insert([
            'name' => str_random(8),
            'ratio' => 1.5,
            'job' => 'full-stack',
            'first_name' => str_random(8),
            'project_id' => 1,
            'created_at' => date('Y-m-d H:m:s'),
        ]);

        DB::table('tasks')->insert([
            'name' => str_random(8),
            'starts_at' => '1991-11-22 07:16:08',
            'ends_at' => '2038-02-20 10:45:17',
            'is_finished' => false,
            'additional_cost' => 145.99,
            'project_id' => 1,
            'speciality_id' => 1,
            'resource_id' => 1,
            'created_at' => date('Y-m-d H:m:s'),
        ]);
    }
}
