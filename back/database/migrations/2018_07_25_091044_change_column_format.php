<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnFormat extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dateTime('ends_at')->nullable()->change();
            $table->unsignedInteger('project_id')->nullable()->change();
            $table->unsignedInteger('speciality_id')->nullable()->change();
            $table->unsignedInteger('resource_id')->nullable()->change();
            $table->string('ends_at')->nullable()->change();
            $table->string('duration')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('duration');
        });
    }
}
