<?php

namespace App\Http\Controllers;

use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TasksResource;

class TaskController extends Controller
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
                'data' => TasksResource::collection(Task::all()),
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
                    'text' => 'required',
                    'start_date' => 'required',
                    'duration' => 'required'
                ]);
                $data = $request->all();
                $data['project_id'] = $project;
                $data['name'] = $request->text;
                $data['starts_at'] = $request->start_date;
                $data['additional_cost'] = $request->has("additional_cost") ? $request->additional_cost : 0.00;
                $tasks = Task::create($data);
                return response()->json([
                    'status' => 'success',
                    'message' => 'successfully created task',
                    'data' => $tasks,
                    'status_code' => 201
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
                'message' => 'Forbidden : You don\'t have access to this project',
                'status_code' => 403
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show($project_id, $id)
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
        if(checkProjectRight($project_id, auth()->user()->id)) {
            return response()->json([
                'status' => 'success',
                'message' => 'You can read this task',
                'data' => new TasksResource(Task::find($id)),
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
     * @param  \App\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $project_id, $id)
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
        if(checkProjectRight($project_id, auth()->user()->id)) {
            if(checkRight(auth()->user()->id,$project_id)){
                $task = Task::find($id);
                $task->name = $request->text;
                $task->starts_at = $request->start_date;
                $task->duration = $request->duration;
                $task->progress = $request->has("progress") ? $request->progress : 0;
                $task->additional_cost = $request->has("additional_cost") ? $request->additional_cost : 0.00;
                if($request->resource_id == 0){
                    $task->resource_id = null;
                }else{
                    $task->resource_id = $request->resource_id;
                }
                $task->save();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully updated task',
                    'data' => $task,
                    'status_code' => 200
                ]);
            } else{
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
     * @param  \App\Task  $task
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
                // InsertLog("deleteTask",$id,auth()->user()->id);
                DB::table('tasks')->where('id', $id)->delete(); 
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

    public function ResourceToTask(Request $request,$project)
    {
        $user_id = auth()->user()->id;
        $resource_id = "";
        $functionName = "";
        $checkRight = checkRight($user_id,$project);
        if($checkRight){
            if($request->action === "add"){
                $resource_id =$request->resource_id;
                $functionName ="AddRessourceToTask";
            }elseif($request->action === "remove"){
                $resource_id = NULL;
                $functionName ="RemoveRessourceToTask";
            }

            $data =  DB::table('tasks')
                ->where('id', $request->task_id)
                ->update(['resource_id' => $resource_id]);

            // InsertLog($functionName,$request->task_id,$user_id);
            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } else {
            return response()->json(["message"=> "Unauthorized action"],401);
        }
    }
}