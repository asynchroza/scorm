import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export function UploadBox() {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5" >
            <Label htmlFor="course" > Course </Label>
            <Input id="course" type="file" className="bg-white"/>
        </div>
    )
}