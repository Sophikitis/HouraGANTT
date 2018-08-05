<?php

namespace App\Http\Controllers;

use App\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ResourcesResource;
use App\Http\Resources\ProjectResource;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
            'status' => 'fail',
            'message' => 'Forbidden : Failed to authenticate user',
            'status_code' => 403
        ]);
        }
        if(checkProjectRight($id, auth()->user()->id)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully listed tasks',
                'data' => ResourcesResource::collection(Resource::all()),
                'status_code' => 200
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Unauthorized : you\'re not allowed on the project',
                'status_code' => 401
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request,$project)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
            'status' => 'fail',
            'message' => 'Forbidden : Failed to authenticate user',
            'status_code' => 403
        ]);
        }
        if(checkProjectRight($project, auth()->user()->id)) {
            if(checkRight(auth()->user()->id, $project)) {
                request()->validate([
                    'name' => 'required',
                ]);
                $data = $request->all();
                $data['project_id'] = $project;
                $ressource = Resource::create($data);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully listed tasks',
                    'data' => $ressource,
                    'status_code' => 200
                ]);
            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Unauthorized : You don\'t have edit right',
                    'status_code' => 401
                ]);
            }  
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Unauthorized : you\'re not allowed on the project',
                'status_code' => 401
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Resource  $resource
     * @return \Illuminate\Http\Response
     */

    public function show($project, $id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
            'status' => 'fail',
            'message' => 'Forbidden : Failed to authenticate user',
            'status_code' => 403
        ]);
        }
        if(checkProjectRight($project, auth()->user()->id)) {
            return response()->json([
                'status' => 'success',
                'message' => 'You can read this resource',
                'data' => new ResourcesResource(Resource::find($id)),
                'status_code' => 200
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : You don\'t have access to this project',
                'status_code' => 403
            ]);
        }        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Resource  $resource
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $project,$id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }
        if(checkProjectRight($project, auth()->user()->id)) {
            if(checkRight(auth()->user()->id,$project)){
                $resource = Resource::find($id);
                $resource->name = $request->name;
                $resource->ratio = $request->ratio;
                $resource->job = $request->job;
                $resource->first_name = $request->first_name;
                $resource->save();
                // InsertLog("UpdateRessource",$id,auth()->user()->id);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully updated task',
                    'data' => $resource,
                    'status_code' => 200
                ]);
            }else{
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Unauthorized : You don\'t have edit right',
                    'status_code' => 401
                ]);
            }
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Resource  $resource
     * @return \Illuminate\Http\Response
     */

    public function destroy(Request $request,$project,$id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }
        if(checkProjectRight($project, auth()->user()->id)) {
            if(checkRight(auth()->user()->id,$project)){
                $data =  DB::table('tasks')
                    ->where('resource_id', $id)
                    ->update(['resource_id' => Null]);
                DB::table('resources')->where('id', $id)->delete();
                // InsertLog("deleteRessource",$id,auth()->user()->id);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully deleted',
                    'status_code' => 200
                ]);
            }else{
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Unauthorized : You don\'t have edit right',
                    'status_code' => 401
                ]);
            }
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }

    }

    public function resourceDetail($id) {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }
        if(checkProjectRight($id, auth()->user()->id)) {
            $resources = DB::table('resources')->where('project_id', $id)->get();
            $render = [];
            foreach ($resources as $key => $value) {

                $render[$key]['name'] = $value->name;
                $render[$key]['id'] = $value->id;
                $render[$key]['project_id'] = $value->project_id;
                $render[$key]['job'] = $value->job;
                $render[$key]['ratio'] = $value->ratio;

                $task = DB::table('tasks')->where('resource_id', $value->id)->get();
                $render[$key]["nb_tasks"] = count($task);
                $nb_hours = 0;
                $nb_days = 0;
                foreach ($task as $subvalue) {
                    $start_end = addDayswithdate($subvalue->starts_at,$subvalue->duration);// return the task end_date
                    $workDays = getWorkdays($subvalue->starts_at,$start_end); // return the task workday exclude week-end
                    $hourPerday = 7 * $workDays;
                    $nb_hours += $hourPerday;
                    $nb_days += $workDays;
                }
                $render[$key]["nb_hours"] = $nb_hours;
                $render[$key]["total_cost"] = $nb_hours * $value->ratio;
                $render[$key]["nb_days"] = $nb_days;
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted',
                'data' => $render,
                'status_code' => 200
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden : Failed to authenticate user',
                'status_code' => 403
            ]);
        }
    }
}
