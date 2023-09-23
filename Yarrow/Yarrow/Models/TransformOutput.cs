using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class TransformOutput
    {
        public int ID { get; }
        public int ParentTransformID { get; }
        public string Name { get; }
        public float[] Matrix { get; }

        [JsonConstructor]
        public TransformOutput(int iD, int parentTransformID, string name, float[] matrix)
        {
            ID = iD;
            ParentTransformID = parentTransformID;
            Name = name;
            Matrix = matrix;
        }

        public TransformOutput(Transform t)
            : this(
                  t.Id,
                  t.ParentTransformId ?? 0,
                  t.Name,
                  t.Matrix)
        {
        }

        public TransformOutput(SerializationInfo info, StreamingContext context)
            : this(
                info.GetInt32(nameof(ID)),
                info.GetInt32(nameof(ParentTransformID)),
                info.GetString(nameof(Name)),
                info.GetValue<float[]>(nameof(Matrix)))
        {
        }
    }
}
