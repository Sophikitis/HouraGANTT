<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class ProjectResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'duration_days' => $this->duration_days,
            'description' => $this->description,
            'links' => $this->links,
            'billing' => $this->billing,
            'created_at' => (string) $this->created_at,
            'updated_at' => (string) $this->updated_at,
            'tasks' => TasksResource::collection($this->task),
            'resources' => ResourcesResource::collection($this->resources),
        ];
    }
}
