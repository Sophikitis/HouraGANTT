<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::get('me', 'AuthController@me');
    Route::put('me/updateprofil', 'AuthController@UpdateUserInfo');

    Route::post('addResourceTask', 'TaskController@ResourceToTask');
    Route::post('sendPasswordResetLink', 'ResetPasswordController@sendEmail');
    Route::post('resetPassword', 'ChangePasswordController@process');

    Route::resource('link', 'LinkController');
    Route::resource('task', 'TaskController');

    Route::apiResources([
        'projects' => 'ProjectController',
        'projects.tasks' => 'TaskController',
        'projects.resources' => 'ResourceController'
    ]);

    Route::apiResource('roles', 'RoleController')->only(['destroy', 'store', 'index']);

    Route::post('projects/{id}/invite', 'ProjectController@sendInvitation');
    Route::get('projects/{id}/billingcost', 'ProjectController@billingCost');
    Route::get('me/downloadme', 'AuthController@DownloadUserInfo');
    Route::delete('me/forgotme', 'AuthController@ForgetMe');
    Route::post('verify', 'VerifyController@verify');
    Route::get('project/{id}/downloadPDF', 'ProjectController@generatePDF');

    Route::get('projects/{id}/billingcost', 'ProjectController@billingCost');

    Route::get('project/{id}/resourceDetail', 'ResourceController@resourceDetail');

    Route::get('test', 'ProjectController@test');
});

