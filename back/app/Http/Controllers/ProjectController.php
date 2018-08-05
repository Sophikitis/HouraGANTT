<?php

namespace App\Http\Controllers;

use PDF;
use App\Resource;
use App\Task;
use App\User;
use Exception;
use App\Project;

use App\Mail\Invitation;
use Illuminate\Http\Request;
use App\Mail\InvitationProject;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\ProjectResource;

class ProjectController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json(['Forbidden', 403]);
        }
        return DB::table('projects')
                ->join('project_user', function ($join) {
                    $join->on('projects.id', '=', 'project_user.project_id')
                         ->where('project_user.user_id', '=', auth()->user()->id);
                })->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden',
                'status_code' => 403
            ]);
        }
        $token = $request->header('Authorization');
        $token = substr($token, 6);
        $token = trim($token);
        $user = getUserInfo($token);
        
        // $user_id = $user->id;
        $user_id = auth()->user()->id;
        $project = new Project();
        $project->name = $request->name;
        $project->description = $request->description;
        $project->duration_days = $request->duration_days;
        $project->link = $request->link;
        $project->billing = $request->billing;
        $project->save();

        DB::table('project_user')->insert(
            [
                'user_id' => $user_id,
                'project_id' => $project->id,
                'project_owner' => 0, 
                'right_id' => 1
            ]
        );
        return response()->json([
            'status' => 'success',
            'message' => 'Project successfully created',
            'data' => $project,
            'status_code' => 201
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json([
                'status' => 'fail',
                'message' => 'Forbidden',
                'status_code' => 403
            ]);
        }
        if(checkProjectRight($id, auth()->user()->id)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Project shown successfully',
                'data' => new ProjectResource(Project::find($id)),
                'status_code' => 200
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Unauthorized',
                'status_code' => 401
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json(['Forbidden', 403]);
        }
        if(checkProjectRight($id, auth()->user()->id)) {
            if(checkRight(auth()->user()->id, $id)) {
                // MODIF JEREM
                $project = Project::find($id);
                $project->name = $request->name;
                $project->description = $request->description;
                $project->duration_days = $request->duration_days;
                $project->link = $request->link;
                $project->billing = $request->billing;
                $project->save();


                // DB::table('projects')->where('id', $id)->update($request);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully updated',
                    'data' => $request[0], 
                    'status_code' => 200
                ]);
            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Unauthorized : you don\'t have edit right',
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
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
        if(isOwnerProject($id, auth()->user()->id)) {
            $project = DB::table('projects')->where('id', $id)->delete();
            if($project == 1) {
                DB::table('project_user')->where('project_id', $id)->delete();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Successfully removed',
                    'status_code' => 204
                ]);
            } else {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Failed to remove project',
                    'status_code' => 500
                ]);
            }
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'You\'re not authorized or project doesn\'t exist',
                'status_code' => 500
            ]);
        }
    }

    /**
     * Send an invitation mail.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function sendInvitation(Request $request, $id)
    {
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json(['Forbidden', 403]);
        } 
        $project = Project::findOrFail($id);
        $project->temp_username = $request->user_email;
        $project->temp_password = str_random(10);
        try {
            $user_to_create = [
                'first_name' => $project->temp_username,
                'email' => $request->user_email,
                'password' => $project->temp_password
            ];
            $created_user = User::create($user_to_create);
            DB::table('project_user')->insert(
                [
                    'user_id' => $created_user->id,
                    'project_id' => $id,
                    'project_owner' => 1
                ]
            );
            Mail::to($request->user_email)
                ->cc('houragantt-2eebaf@inbox.mailtrap.io')
                ->send(new Invitation($project));
            $message = 'User account created and invitation sent';
        } catch (Exception $e) {
            $user = db::table('users')->select('id')->where('email', $request->user_email)->first();
            DB::table('project_user')->insert(
                [
                    'user_id' => $user->id,
                    'project_id' => $id,
                    'project_owner' => 1
                ]
            );
            Mail::to($request->user_email)
                ->cc('houragantt-2eebaf@inbox.mailtrap.io')
                ->send(new InvitationProject($project));
            $message = 'This user has already an account, invitation has been sent';
        }
        return response()->json($message, 200);
    }

    public function billingCost($id){
        $data = Task::where('project_id', $id)
            ->get();
        $billingTotal = 0;
        $billingPerTask = 0;
        foreach ($data as $value) {
            $start_end = addDayswithdate($value->starts_at,$value->duration);// return the task end_date
            $workDays = getWorkdays($value->starts_at,$start_end); // return the task workday exclude week-end
            $hourPerday = 7 * $workDays;
            if($value->additional_cost){
                $billingPerTask = $billingPerTask+$value->additional_cost; // return the billing when additionalcost is defined
            }
            if($value->resource_id){
                $resource = Resource::find($value->resource_id);
                $billing = $hourPerday * $resource->ratio;
                $billingPerTask = $billing + $billingPerTask; // return the billing when resource is defined
            }
            $billingTotal+=$billingPerTask; //return the billing per task
            $billingPerTask =0;
        }
       return $billingTotal; //return the Total billing
   }

    /**
     * Generate a stat report PDF.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($id) { 
        try {
           $user = auth()->userOrFail();
        } catch (\Tymon\JWTAuth\Exceptions\UserNotDefinedException $e) {
           return response()->json(['Forbidden', 403]);
        }
        if(checkProjectRight($id, auth()->user()->id)) {
            $project = $this->get_json_from('http://192.168.33.10/api/projects/' . $id);
            $project->total_cost = $this->billingCost($id);
            $project->how_many_tasks = 0;
            foreach ($project->data->tasks as $key => $value) {
                $project->how_many_tasks += 1;
            }
            $project->how_many_resources = 0;
            foreach ($project->data->resources as $key => $value) {
                $project->how_many_resources += 1;
            }
            $url = date('Y-m-d') . '_' . $project->data->name . '_report.pdf';
            $pdf = PDF::loadView('pdf', compact('project'))->save($url);
            // return $pdf->stream($project->data->name .'_report.pdf');
            // $saved = PDF::loadHTML('pdf')->save(date('Y-m-d') . '_' . $project->data->name . '_report.pdf');
            Storage::put('download.pdf', $pdf);
            return response()->json([
                'status' => 'success',
                'message' => 'PDF generated',
                'url' => 'http://192.168.33.10/' . $url,
                'status_code' => 200
            ]);
        } else {
            return response()->json(['Unauthorized', 401]);
        }
    }

    /**
     * Retrieve the json of an endpoint.
     *
     * @param  string  $url
     * @return \Illuminate\Http\Response
     */
    protected function get_json_from($url) {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => array('Authorization: Bearer ' . auth()->user()->token)
        ));
        return json_decode(curl_exec($curl));
    }

}
